import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Sage } from '@/models/sage.model';
import { SageAvatarComponent } from '@/ui/sage-avatar/sage-avatar.component';

/** Le conseil en cours de composition : un clic sur un avatar retire le sage. */
@Component({
  selector: 'app-council-slots',
  imports: [SageAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="caption count">Ton conseil : {{ sages().length }} sur {{ max() }}</p>
    <ul class="slots" aria-label="Sages du conseil">
      @for (sage of sages(); track sage.id) {
        <li>
          <button type="button" class="slot" [attr.aria-label]="'Retirer ' + sage.name" [title]="sage.name" (click)="removed.emit(sage.id)">
            <app-sage-avatar [icon]="sage.icon" [color]="sage.color" [size]="40" [decorative]="true" />
          </button>
        </li>
      }
    </ul>
  `,
  styles: `
    :host {
      display: grid;
      gap: var(--space-2);
      min-width: 0;
    }
    .count {
      margin: 0;
      color: var(--ink-muted);
    }
    .slots {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
      min-height: 44px;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .slot {
      padding: 2px;
      border: 0;
      border-radius: var(--radius-full);
      background: none;
      cursor: pointer;
    }
  `,
})
export class CouncilSlotsComponent {
  readonly sages = input.required<Sage[]>();
  readonly max = input.required<number>();
  readonly removed = output<number>();
}
