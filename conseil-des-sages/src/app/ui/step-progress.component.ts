import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DebateStep } from '../data/models';
import { IconComponent } from './icon.component';

export const STEPS: { id: DebateStep; label: string }[] = [
  { id: 'ouverture', label: 'Ouverture' },
  { id: 'confrontation', label: 'Confrontation' },
  { id: 'finale', label: 'Position finale' },
  { id: 'synthese', label: 'Synthèse' },
];

/** Debate progress bar. Step states: done · current (with inner progress) · upcoming. */
@Component({
  selector: 'app-step-progress',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ol class="steps" aria-label="Étapes de la réflexion">
      @for (s of steps; track s.id; let i = $index) {
        <li
          class="step"
          [attr.data-state]="i < index() ? 'done' : i === index() ? 'current' : 'upcoming'"
          [attr.aria-current]="i === index() ? 'step' : null"
        >
          <span class="marker">
            @if (i < index()) {
              <app-icon name="check" [size]="13" [stroke]="3" />
            } @else {
              {{ i + 1 }}
            }
          </span>
          <span class="label">{{ s.label }}</span>
          @if (i < steps.length - 1) {
            <span class="track">
              <span
                class="fill"
                [style.transform]="'scaleX(' + (i < index() ? 1 : i === index() ? progress() : 0) + ')'"
              ></span>
            </span>
          }
        </li>
      }
    </ol>
  `,
  styles: `
    :host {
      display: block;
    }
    .steps {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .step {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      min-width: 0;
    }
    .step:last-child {
      flex: 0 0 auto;
    }
    .marker {
      display: grid;
      place-items: center;
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      font-size: 13px;
      font-weight: 700;
      border: 1.5px solid var(--glass-border-strong);
      color: var(--text-3);
      transition: all 300ms var(--ease);
    }
    .label {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-3);
      white-space: nowrap;
    }
    .track {
      position: relative;
      flex: 1;
      height: 3px;
      min-width: 16px;
      border-radius: 3px;
      background: var(--glass-border);
      overflow: hidden;
    }
    .fill {
      position: absolute;
      inset: 0;
      background: var(--text);
      transform-origin: left;
      transition: transform 600ms var(--ease);
    }
    [data-state='done'] .marker {
      background: var(--text-2);
      border-color: var(--text-2);
      color: var(--primary-fg);
    }
    [data-state='done'] .label {
      color: var(--text-2);
    }
    [data-state='current'] .marker {
      background: var(--primary);
      border-color: var(--primary);
      color: var(--primary-fg);
      box-shadow: 0 0 0 5px color-mix(in srgb, var(--primary) 18%, transparent);
    }
    [data-state='current'] .label {
      color: var(--text);
    }
    @media (max-width: 720px) {
      .step:not([data-state='current']) .label {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
      }
      .steps, .step { gap: 8px; }
    }
  `,
})
export class StepProgressComponent {
  readonly current = input<DebateStep>('ouverture');
  /** 0..1 progress inside the current step */
  readonly progress = input(0);
  protected readonly steps = STEPS;
  protected readonly index = computed(() => STEPS.findIndex((s) => s.id === this.current()));
}
