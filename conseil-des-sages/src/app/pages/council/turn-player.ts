import { signal } from '@angular/core';

export interface PlayedTurn {
  sageId: number;
  stepId: number;
  text: string;
  complete: boolean;
  repliesTo: number | null;
}

/** Le temps laissé à une intervention une fois écrite : assez pour finir sa phrase, sans ralentir le débat. */
export const TURN_DWELL_MS = 2_500;

/**
 * Rythme l'affichage du débat. Un modèle écrit bien plus vite qu'on ne lit : les interventions reçues
 * sont mises en file, écrites à un rythme lisible, puis cèdent vite la place à la suivante.
 */
export class TurnPlayer {
  private readonly queue: PlayedTurn[] = [];
  private revealedLength = 0;
  private dwellLeft = 0;
  private shown: PlayedTurn | null = null;

  readonly current = signal<PlayedTurn | null>(null);
  readonly revealed = signal('');
  readonly drained = signal(true);
  readonly paused = signal(false);
  /** Ce qui a déjà été affiché : on peut le revoir sans rien dévoiler de ce qui arrive. */
  readonly heard = signal<PlayedTurn[]>([]);

  constructor(private readonly charsPerSecond: number) {}

  /** Un débat rouvert en cours de route : ce qui est déjà enregistré compte comme entendu. */
  seed(heard: PlayedTurn[]): void {
    this.heard.set(heard);
  }

  begin(sageId: number, stepId: number): void {
    const open = this.openTurn();
    // Après une reconnexion, le serveur rejoue le tour en cours avec tout son texte.
    if (open && open.sageId === sageId && open.stepId === stepId) {
      this.restart();
      return;
    }
    this.queue.push({ sageId, stepId, text: '', complete: false, repliesTo: null });
    this.sync();
  }

  append(text: string): void {
    const turn = this.openTurn();
    if (turn) turn.text += text;
  }

  /** Le fournisseur a échoué et un autre reprend : ce qui a été écrit est oublié. */
  restart(): void {
    const turn = this.openTurn();
    if (!turn) return;
    turn.text = '';
    if (turn === this.shown) {
      this.revealedLength = 0;
      this.revealed.set('');
    }
  }

  complete(text: string, repliesTo: number | null): void {
    const turn = this.openTurn();
    if (!turn) return;
    turn.text = text;
    turn.repliesTo = repliesTo;
    turn.complete = true;
    if (turn === this.shown) {
      this.current.set({ ...turn });
    }
  }

  /** Revoir un débat déjà terminé. */
  enqueue(turn: PlayedTurn): void {
    this.queue.push(turn);
    this.sync();
  }

  tick(elapsedMs: number): void {
    if (this.paused() || !this.shown) return;
    const turn = this.shown;
    if (this.revealedLength < turn.text.length) {
      this.reveal(Math.min(turn.text.length, this.revealedLength + (this.charsPerSecond * elapsedMs) / 1000), turn);
      return;
    }
    if (!turn.complete) return;
    this.dwellLeft -= elapsedMs;
    if (this.dwellLeft <= 0) {
      this.advance();
    }
  }

  /** Affiche tout de suite la fin de l'intervention, ou passe à la suivante si elle est déjà affichée. */
  skip(): void {
    const turn = this.shown;
    if (!turn) return;
    if (this.revealedLength < turn.text.length) {
      this.reveal(turn.text.length, turn);
    } else if (turn.complete) {
      this.advance();
    }
  }

  /** Panne en plein tour : le sage ne parlera pas, on retire son tour sans toucher à ce qui a été dit. */
  dropOpenTurn(): void {
    const turn = this.openTurn();
    if (!turn) return;
    this.queue.pop();
    if (turn === this.shown) {
      this.shown = null;
      this.revealedLength = 0;
      this.current.set(null);
      this.revealed.set('');
    }
    this.sync();
  }

  togglePause(): void {
    this.paused.update((paused) => !paused);
  }

  clear(): void {
    this.queue.length = 0;
    this.shown = null;
    this.revealedLength = 0;
    this.current.set(null);
    this.revealed.set('');
    this.drained.set(true);
    this.heard.set([]);
  }

  private openTurn(): PlayedTurn | null {
    const last = this.queue.at(-1);
    return last && !last.complete ? last : null;
  }

  private reveal(length: number, turn: PlayedTurn): void {
    this.revealedLength = length;
    this.revealed.set(turn.text.slice(0, Math.floor(length)));
  }

  private advance(): void {
    const turn = this.shown;
    if (turn) this.heard.update((heard) => [...heard, turn]);
    this.queue.shift();
    this.shown = null;
    this.sync();
  }

  /** Quand la file se vide, la dernière intervention reste affichée en attendant la suivante. */
  private sync(): void {
    const head = this.queue[0];
    if (!this.shown && head) {
      this.shown = head;
      this.revealedLength = 0;
      this.revealed.set('');
      this.dwellLeft = TURN_DWELL_MS;
      this.current.set({ ...head });
    }
    this.drained.set(this.queue.length === 0);
  }
}
