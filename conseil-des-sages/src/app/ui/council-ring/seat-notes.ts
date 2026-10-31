import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface SeatNote {
  label: string;
  text: string;
}

/** Ce qu'a dit un participant, tour par tour. */
@Component({
  selector: 'app-seat-notes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (note of notes(); track $index) {
      <div class="note">
        <p class="cds-label">{{ note.label }}</p>
        <p class="body text">{{ note.text }}</p>
      </div>
    } @empty {
      <p class="body empty">{{ emptyText() }}</p>
    }
  `,
  styles: `
    :host {
      display: grid;
      gap: var(--space-4);
    }
    .note {
      display: grid;
      gap: var(--space-1);
    }
    p {
      margin: 0;
    }
    .text {
      white-space: pre-line;
    }
    .empty {
      color: var(--ink-muted);
    }
  `,
})
export class SeatNotesComponent {
  readonly notes = input.required<SeatNote[]>();
  readonly emptyText = input('N’a pas encore parlé.');
}
