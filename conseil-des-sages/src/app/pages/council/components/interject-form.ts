import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { apiErrorMessage } from '@/services/api/api-error';
import { IconComponent } from '@/ui/icon.component';
import { DebateRoomStore } from '../debate-room.store';

/** La personne précise sa situation pendant le débat : les prochains sages en tiennent compte. */
@Component({
  selector: 'app-interject-form',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="cds-glass form" (submit)="$event.preventDefault(); send()">
      <label class="sr-only" for="precision">Ta précision</label>
      <input
        id="precision"
        class="field"
        maxlength="1000"
        placeholder="Une précision pour le conseil ?"
        autocomplete="off"
        [value]="content()"
        (input)="content.set($any($event.target).value)"
      />
      <button type="button" class="cds-btn cds-btn--ghost cds-btn--sm" (click)="closed.emit()">Annuler</button>
      <button type="submit" class="cds-btn cds-btn--sm" [disabled]="!content().trim() || sending()">
        <app-icon name="arrow-up" [size]="16" /> Envoyer
      </button>
    </form>
    @if (error()) {
      <p class="cds-error" role="alert">{{ error() }}</p>
    }
  `,
  styles: `
    :host {
      display: grid;
      gap: var(--space-1);
      width: min(100%, 760px);
    }
    .form {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-1) var(--space-2) var(--space-1) var(--space-4);
      border-radius: var(--radius-full);
    }
    .field {
      flex: 1;
      min-width: 0;
      min-height: 36px;
      border: 0;
      outline: none;
      background: transparent;
      color: var(--ink);
      font: 400 15px/24px var(--font-sans);
    }
    .field::placeholder {
      color: var(--ink-subtle);
      opacity: 1;
    }
    p {
      margin: 0;
      text-align: center;
    }
  `,
})
export class InterjectFormComponent {
  private readonly room = inject(DebateRoomStore);
  readonly closed = output<void>();

  protected readonly content = signal('');
  protected readonly sending = signal(false);
  protected readonly error = signal('');

  protected send(): void {
    const content = this.content().trim();
    if (!content || this.sending()) return;
    this.sending.set(true);
    this.error.set('');
    this.room.interject(content).subscribe({
      next: () => this.closed.emit(),
      error: (error: unknown) => {
        this.sending.set(false);
        this.error.set(apiErrorMessage(error));
      },
    });
  }
}
