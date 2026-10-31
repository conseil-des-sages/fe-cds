import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AvatarState, SageColor } from '../data/models';
import { IconComponent } from './icon.component';

/**
 * Round sage avatar. States: idle | speaking | thinking | dimmed | selected.
 * Identity is always conveyed by icon + accessible name, never by colour alone.
 */
@Component({
  selector: 'app-sage-avatar',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.role]': 'decorative() ? null : "img"',
    '[attr.aria-label]': 'decorative() ? null : name()',
    '[attr.aria-hidden]': 'decorative() ? "true" : null',
    '[attr.data-state]': 'state()',
    '[style.--c]': 'colorVar()',
    '[style.--size.px]': 'size()',
  },
  template: `
    <span class="disc">
      <app-icon [name]="icon()" [size]="iconSize()" [stroke]="size() > 48 ? 1.6 : 1.9" />
    </span>
    @if (state() === 'selected') {
      <span class="tick"><app-icon name="check" [size]="12" [stroke]="3" /></span>
    }
  `,
  styles: `
    :host {
      position: relative;
      display: inline-grid;
      place-items: center;
      flex-shrink: 0;
      width: var(--size);
      height: var(--size);
      border-radius: 50%;
      transition:
        transform 500ms var(--ease),
        opacity 400ms,
        filter 400ms;
    }
    .disc {
      display: grid;
      place-items: center;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      color: var(--c);
      background:
        radial-gradient(120% 120% at 30% 20%, color-mix(in srgb, var(--c) 34%, transparent), transparent 70%),
        var(--glass-3);
      border: 1.5px solid color-mix(in srgb, var(--c) 60%, transparent);
      box-shadow: inset 0 1px 0 var(--glass-highlight);
      transition: box-shadow 500ms var(--ease);
    }
    :host([data-state='speaking']) {
      transform: scale(1.14);
    }
    :host([data-state='speaking']) .disc {
      border-color: var(--c);
      box-shadow:
        0 0 0 5px color-mix(in srgb, var(--c) 22%, transparent),
        0 0 42px 6px color-mix(in srgb, var(--c) 55%, transparent);
    }
    :host([data-state='dimmed']) {
      opacity: 0.5;
      filter: saturate(0.55);
    }
    :host([data-state='thinking'])::after {
      content: '';
      position: absolute;
      inset: -7px;
      border-radius: 50%;
      border: 2px dashed color-mix(in srgb, var(--c) 75%, transparent);
      animation: spin 7s linear infinite;
    }
    :host([data-state='thinking']) .disc {
      animation: breathe 1.8s ease-in-out infinite;
    }
    :host([data-state='selected']) .disc {
      border-color: var(--c);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--c) 30%, transparent);
    }
    .tick {
      position: absolute;
      right: -2px;
      bottom: -2px;
      display: grid;
      place-items: center;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: var(--primary);
      color: var(--primary-fg);
      border: 2px solid var(--bg-2);
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes breathe {
      50% { box-shadow: 0 0 22px 2px color-mix(in srgb, var(--c) 40%, transparent); }
    }
  `,
})
export class SageAvatarComponent {
  readonly icon = input.required<string>();
  readonly color = input.required<SageColor>();
  readonly name = input<string>('');
  readonly size = input<number>(56);
  readonly state = input<AvatarState>('idle');
  readonly decorative = input<boolean>(false);

  protected readonly colorVar = computed(() => `var(--sage-${this.color()})`);
  protected readonly iconSize = computed(() => Math.round(this.size() * 0.44));
}
