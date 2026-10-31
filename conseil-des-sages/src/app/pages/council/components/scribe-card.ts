import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { ScribeNote } from '@/models/debate.model';
import { Sage } from '@/models/sage.model';
import { SageAvatarComponent } from '@/ui/sage-avatar/sage-avatar.component';

const SPEAKING_MS = 8_000;

/** Le Greffier, hors du débat : il observe, et remarque de temps à autre un tournant ou l'état du débat. */
@Component({
  selector: 'app-scribe-card',
  imports: [SageAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="cds-glass cds-glass--strong card"
      [class.is-speaking]="speaking()"
      [style.--sage]="'var(--sage-' + scribe().color + ')'"
      aria-label="Revoir les notes du Greffier"
      (click)="opened.emit()"
    >
      <span class="head">
        <app-sage-avatar [icon]="scribe().icon" [color]="scribe().color" [size]="32" [state]="speaking() ? 'speaking' : 'idle'" [decorative]="true" />
        <span class="who">
          <span class="caption name">{{ scribe().name }}</span>
          <span class="caption status">{{ statusLabel() }}</span>
        </span>
      </span>
      @for (note of lastNote(); track note.id) {
        <span class="body note" role="status">{{ note.content }}</span>
      }
    </button>
  `,
  styleUrl: './scribe-card.css',
})
export class ScribeCardComponent {
  readonly scribe = input.required<Sage>();
  readonly notes = input.required<ScribeNote[]>();
  readonly writing = input(false);
  readonly opened = output<void>();

  /** Une liste d'au plus un élément : chaque nouvelle note rejoue son apparition. */
  protected readonly lastNote = computed(() => this.notes().slice(-1));
  private readonly lastNoteId = computed(() => this.notes().at(-1)?.id ?? null);
  /** La carte se met en avant le temps de lire une remarque : à l'écart du débat, elle passerait inaperçue. */
  protected readonly speaking = signal(false);
  protected readonly statusLabel = computed(() => {
    if (this.writing()) return 'rédige la synthèse…';
    return this.speaking() ? 'fait une remarque' : 'observe le débat';
  });

  constructor() {
    effect((onCleanup) => {
      // L'identifiant et non la liste : celle-ci est recalculée à chaque intervention, sans nouvelle remarque.
      if (this.lastNoteId() === null) return;
      this.speaking.set(true);
      const timer = setTimeout(() => this.speaking.set(false), SPEAKING_MS);
      onCleanup(() => clearTimeout(timer));
    });
  }
}
