import { Injectable, OnDestroy, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { DebateDetail, DebateEvent, DebateMessage, Synthesis } from '@/models/debate.model';
import { Sage } from '@/models/sage.model';
import { DebatesApi } from '@/services/api/debates.api';
import { SeatNote } from '@/ui/council-ring/seat-notes';
import { DebateStreamService } from '@/services/debate-stream.service';
import { PlayedTurn, TURN_DWELL_MS, TurnPlayer } from './turn-player';

export type RoomPhase = 'loading' | 'live' | 'finished' | 'failed' | 'missing';

export interface StepItem {
  id: number;
  label: string;
  state: 'upcoming' | 'active' | 'done';
}

const TICK_MS = 50;
const CHARS_PER_SECOND = 55;
/** Longueur d'une réponse tant qu'aucune n'a été lue, pour estimer le temps restant */
const TYPICAL_ANSWER_CHARS = 480;
const SYNTHESIS_SECONDS = 8;
const INSTANT_CHARS_PER_SECOND = 100_000;
const SYNTHESIS_ORDER = 4;
const MAX_SILENT_RECONNECTS = 3;

function toTurn(message: DebateMessage): PlayedTurn {
  return {
    sageId: message.participantId,
    stepId: message.stepId,
    text: message.content,
    complete: true,
    repliesTo: message.repliesToParticipantId,
  };
}

/** L'état d'une salle du conseil : le débat, son flux en direct et ce qui est affiché. */
@Injectable()
export class DebateRoomStore implements OnDestroy {
  private readonly api = inject(DebatesApi);
  private readonly stream = inject(DebateStreamService);
  private abort: AbortController | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private lastEventEndedStream = false;
  private silentReconnects = 0;

  readonly player = new TurnPlayer(
    typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
      ? INSTANT_CHARS_PER_SECOND
      : CHARS_PER_SECOND,
  );
  readonly debate = signal<DebateDetail | null>(null);
  readonly phase = signal<RoomPhase>('loading');
  readonly failure = signal('');

  readonly sages = computed(() => this.debate()?.sages ?? []);
  readonly synthesis = computed<Synthesis | null>(() => this.debate()?.synthesis ?? null);
  readonly transcript = computed(() => (this.debate()?.steps ?? []).filter((step) => step.messages.length > 0));

  /** Les personnes qui ont la parole dans le fil : les sages et le Greffier */
  readonly speakers = computed(() => {
    const debate = this.debate();
    return debate ? [...debate.sages, ...(debate.scribe ? [debate.scribe] : [])] : [];
  });

  /** Ce qu'a déjà dit chaque sage, pour le revoir au survol de son avatar */
  readonly seatNotes = computed<Record<number, SeatNote[]>>(() => {
    const notes: Record<number, SeatNote[]> = {};
    for (const turn of this.player.heard()) {
      (notes[turn.sageId] ??= []).push({ label: this.stepName(turn.stepId), text: turn.text });
    }
    return notes;
  });
  /** Le Greffier suit l'affichage : sa remarque apparaît une fois lues les interventions qu'elle commente. */
  readonly visibleNotes = computed(() => {
    const heard = this.player.heard().length;
    return (this.debate()?.notes ?? []).filter((note) => note.afterTurns <= heard);
  });
  readonly scribeNotes = computed<SeatNote[]>(() =>
    this.visibleNotes().map((note) => ({ label: `Après ${note.afterTurns} interventions`, text: note.content })),
  );

  readonly statusLine = computed(() => {
    const debate = this.debate();
    if (!debate) return '';
    const rounds = debate.steps.filter((step) => step.order !== SYNTHESIS_ORDER);
    if (this.showSynthesis()) {
      const interventions = rounds.flatMap((step) => step.messages).filter((m) => !m.fromUser).length;
      return `Débat terminé · ${rounds.length} tours · ${interventions} interventions`;
    }
    if (this.isScribing()) return `${rounds.length} tours terminés · Synthèse en cours`;
    const shown = this.player.current();
    const step = rounds.find((other) => other.id === shown?.stepId) ?? rounds.find((other) => other.status !== 'DONE');
    if (!step) return '';
    const heard = this.player.heard().filter((turn) => turn.stepId === step.id).length;
    const speaking = shown?.stepId === step.id ? 1 : 0;
    const turn = Math.min(heard + Math.max(speaking, 1), debate.sages.length);
    const parts = [`Tour ${step.order} sur ${rounds.length}`, `Parole ${turn} sur ${debate.sages.length}`];
    const remaining = this.remainingLabel();
    return (remaining ? [...parts, remaining] : parts).join(' · ');
  });

  readonly speaker = computed<Sage | null>(() => this.findSage(this.player.current()?.sageId));
  readonly isTurnOpen = computed(() => {
    const turn = this.player.current();
    return !!turn && !turn.complete && !this.player.drained();
  });
  readonly isThinking = computed(() => this.isTurnOpen() && this.player.revealed().length === 0);

  /** Le Greffier écrit : plus aucun sage ne parle et l'étape de synthèse est ouverte. */
  readonly isScribing = computed(() => {
    const step = this.debate()?.steps.find((other) => other.order === SYNTHESIS_ORDER);
    return this.phase() === 'live' && step?.status === 'IN_PROGRESS' && this.player.drained();
  });

  readonly showSynthesis = computed(
    () => this.phase() === 'finished' && this.player.drained() && !!this.synthesis(),
  );

  readonly steps = computed<StepItem[]>(() => {
    const debate = this.debate();
    if (!debate) return [];
    if (this.showSynthesis()) {
      return debate.steps.map((step) => ({ id: step.id, label: step.name, state: 'done' }));
    }
    const shown = this.player.current()?.stepId;
    const shownOrder = debate.steps.find((step) => step.id === shown)?.order;
    const running = debate.steps.find((step) => step.status !== 'DONE')?.order ?? SYNTHESIS_ORDER;
    const active = this.isScribing() ? SYNTHESIS_ORDER : (shownOrder ?? running);
    return debate.steps.map((step) => ({
      id: step.id,
      label: step.name,
      state: step.order < active ? 'done' : step.order === active ? 'active' : 'upcoming',
    }));
  });

  /** Une estimation simple, à partir de la longueur des réponses déjà lues */
  private readonly remainingLabel = computed(() => {
    const debate = this.debate();
    // Le serveur finit souvent avant l'affichage : on estime tant que le débat défile à l'écran.
    if (!debate || (this.phase() !== 'live' && this.player.drained())) return '';
    const heard = this.player.heard();
    const rounds = debate.steps.filter((step) => step.order !== SYNTHESIS_ORDER).length;
    const remaining = Math.max(0, rounds * debate.sages.length - heard.length);
    const averageChars = heard.length
      ? heard.reduce((total, turn) => total + turn.text.length, 0) / heard.length
      : TYPICAL_ANSWER_CHARS;
    const seconds = remaining * (averageChars / CHARS_PER_SECOND + TURN_DWELL_MS / 1000) + SYNTHESIS_SECONDS;
    return seconds < 60 ? 'moins d’une minute' : `environ ${Math.ceil(seconds / 60)} min restantes`;
  });

  open(debateId: number): void {
    this.close();
    this.phase.set('loading');
    this.timer = setInterval(() => this.player.tick(TICK_MS), TICK_MS);
    this.load(debateId);
  }

  /** Relance après une panne : le serveur reprend au premier sage qui n'a pas encore parlé. */
  retry(): void {
    const debate = this.debate();
    if (debate) {
      this.phase.set('live');
      this.failure.set('');
      this.silentReconnects = 0;
      this.player.clear();
      this.load(debate.id);
    }
  }

  /** Rejoue un débat terminé, à partir de ses messages enregistrés. */
  replay(): void {
    const debate = this.debate();
    if (!debate) return;
    this.player.clear();
    debate.steps
      .flatMap((step) => step.messages)
      .filter((message) => !message.fromUser)
      .forEach((message) => this.player.enqueue(toTurn(message)));
  }

  interject(content: string): Observable<DebateMessage> {
    return this.api.interject(this.debate()!.id, content);
  }

  findSage(id: number | null | undefined): Sage | null {
    return this.sages().find((sage) => sage.id === id) ?? null;
  }

  ngOnDestroy(): void {
    this.close();
  }

  private close(): void {
    this.abort?.abort();
    this.abort = null;
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.player.clear();
  }

  private load(debateId: number): void {
    this.api.get(debateId).subscribe({
      next: (debate) => {
        this.debate.set(debate);
        this.seedPlayer(debate);
        if (debate.status === 'IN_PROGRESS') {
          this.phase.set('live');
          void this.connect(debateId);
        } else {
          this.phase.set('finished');
        }
      },
      error: () => this.phase.set(this.debate() ? 'failed' : 'missing'),
    });
  }

  /** À l'ouverture seulement : une reconnexion en plein débat garde ce qui reste à afficher. */
  private seedPlayer(debate: DebateDetail): void {
    if (!this.player.drained() || this.player.current() || this.player.heard().length) return;
    const messages = debate.steps.flatMap((step) => step.messages).filter((message) => !message.fromUser);
    this.player.seed(messages.map(toTurn));
  }

  private stepName(stepId: number): string {
    return this.debate()?.steps.find((step) => step.id === stepId)?.name ?? '';
  }

  private async connect(debateId: number): Promise<void> {
    this.abort?.abort();
    const abort = new AbortController();
    this.abort = abort;
    this.lastEventEndedStream = false;
    try {
      await this.stream.follow(debateId, abort.signal, (event) => this.onEvent(event));
      if (abort.signal.aborted || this.lastEventEndedStream) return;
      // Le flux s'est fermé sans annoncer la fin (délai du serveur, redémarrage) : on recharge l'état.
      if (++this.silentReconnects > MAX_SILENT_RECONNECTS) {
        this.fail('Le conseil ne répond plus.');
        return;
      }
      this.load(debateId);
    } catch {
      if (!abort.signal.aborted) {
        this.fail('Le conseil ne répond plus.');
      }
    }
  }

  private onEvent(event: DebateEvent): void {
    this.silentReconnects = 0;
    switch (event.type) {
      case 'turn':
        this.player.begin(event.data.sageId, event.data.stepId);
        break;
      case 'delta':
        this.player.append(event.data.text);
        break;
      case 'reset':
        this.player.restart();
        break;
      case 'message':
        this.addMessage(event.data);
        if (!event.data.fromUser) {
          this.player.complete(event.data.content, event.data.repliesToParticipantId);
        }
        break;
      case 'step':
        this.patch((debate) => ({
          ...debate,
          steps: debate.steps.map((step) =>
            step.id === event.data.stepId ? { ...step, status: event.data.status } : step,
          ),
        }));
        break;
      case 'note':
        this.patch((debate) => ({ ...debate, notes: [...debate.notes, event.data] }));
        break;
      case 'synthesis':
        this.patch((debate) => ({ ...debate, synthesis: event.data }));
        break;
      case 'status':
        this.lastEventEndedStream = true;
        this.patch((debate) => ({ ...debate, status: event.data.status }));
        this.phase.set('finished');
        break;
      case 'failure':
        this.lastEventEndedStream = true;
        this.fail(event.data.detail);
        break;
    }
  }

  private addMessage(message: DebateMessage): void {
    this.patch((debate) => ({
      ...debate,
      steps: debate.steps.map((step) =>
        step.id === message.stepId && !step.messages.some((other) => other.id === message.id)
          ? { ...step, messages: [...step.messages, message] }
          : step,
      ),
    }));
  }

  private patch(change: (debate: DebateDetail) => DebateDetail): void {
    this.debate.update((debate) => (debate ? change(debate) : debate));
  }

  private fail(detail: string): void {
    this.player.dropOpenTurn();
    this.failure.set(detail);
    this.phase.set('failed');
  }
}
