import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CouncilRingComponent } from '@/ui/council-ring/council-ring.component';
import { IconComponent } from '@/ui/icon.component';
import { InterventionPanelComponent } from '@/ui/intervention-panel/intervention-panel.component';
import { ModalComponent } from '@/ui/modal/modal.component';
import { StepProgressComponent } from '@/ui/step-progress/step-progress.component';
import { SeatNotesComponent } from '@/ui/council-ring/seat-notes';
import { InterjectFormComponent } from './components/interject-form';
import { ScribeCardComponent } from './components/scribe-card';
import { SynthesisViewComponent } from './components/synthesis-view';
import { TranscriptComponent } from './components/transcript';
import { DebateRoomStore } from './debate-room.store';

/** La salle du conseil : pleine hauteur, sans défilement de page. */
@Component({
  selector: 'app-council-page',
  imports: [
    RouterLink,
    CouncilRingComponent,
    IconComponent,
    InterventionPanelComponent,
    ModalComponent,
    StepProgressComponent,
    InterjectFormComponent,
    SynthesisViewComponent,
    TranscriptComponent,
    ScribeCardComponent,
    SeatNotesComponent,
  ],
  providers: [DebateRoomStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './council.page.html',
  styleUrl: './council.page.css',
})
export class CouncilPage {
  protected readonly room = inject(DebateRoomStore);

  /** Paramètre :id de la route */
  readonly id = input.required<string>();

  protected readonly transcriptOpen = signal(false);
  protected readonly interjecting = signal(false);
  protected readonly reviewedId = signal<number | null>(null);
  protected readonly reviewedSage = computed(
    () => this.room.speakers().find((sage) => sage.id === this.reviewedId()) ?? null,
  );
  protected readonly reviewedNotes = computed(() => {
    const id = this.reviewedId();
    if (id === null) return [];
    return id === this.room.debate()?.scribe?.id ? this.room.scribeNotes() : (this.room.seatNotes()[id] ?? []);
  });

  protected readonly activeId = computed(() =>
    this.room.isThinking() ? null : (this.room.speaker()?.id ?? null),
  );
  protected readonly thinkingId = computed(() => (this.room.isThinking() ? (this.room.speaker()?.id ?? null) : null));
  protected readonly repliesTo = computed(() => this.room.findSage(this.room.player.current()?.repliesTo));
  protected readonly stepLabel = computed(
    () => this.room.debate()?.steps.find((step) => step.id === this.room.player.current()?.stepId)?.name ?? '',
  );

  constructor() {
    effect(() => this.room.open(Number(this.id())));
  }
}
