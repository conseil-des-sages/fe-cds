import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from '../icon.component';

export interface ProgressStep {
  id: number;
  label: string;
  state: 'upcoming' | 'active' | 'done';
}

/** La barre des étapes de la réflexion. Sur mobile, seul le libellé de l'étape en cours reste visible. */
@Component({
  selector: 'app-step-progress',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="cds-glass cds-steps" aria-label="Étapes du débat">
      @for (step of steps(); track step.id; let index = $index; let last = $last) {
        <div
          class="cds-step"
          [class.cds-step--done]="step.state === 'done'"
          [class.cds-step--active]="step.state === 'active'"
          [attr.aria-current]="step.state === 'active' ? 'step' : null"
        >
          <span class="cds-step__dot">
            @if (step.state === 'done') {
              <app-icon name="check" [size]="14" [stroke]="2.5" />
            } @else {
              {{ index + 1 }}
            }
          </span>
          <span class="cds-step__text">{{ step.label }}</span>
        </div>
        @if (!last) {
          <div class="cds-step__line" [class.cds-step__line--done]="step.state === 'done'"></div>
        }
      }
    </nav>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class StepProgressComponent {
  readonly steps = input.required<ProgressStep[]>();
}
