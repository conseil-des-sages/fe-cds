import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Sage } from '../data/models';
import { SAGE_COLORS } from '../data/sages';
import { IconComponent } from './icon.component';
import { SageAvatarComponent } from './sage-avatar.component';

/** Selectable sage card. States: default · hover · selected · disabled (council full) · static preview. */
@Component({
  selector: 'app-sage-card',
  imports: [SageAvatarComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="card"
      [class.is-selected]="selected()"
      [class.is-static]="preview()"
      [attr.aria-pressed]="preview() ? null : selected()"
      [attr.tabindex]="preview() ? -1 : null"
      [disabled]="disabled() && !selected()"
      [style.--c]="'var(--sage-' + sage().color + ')'"
      (click)="toggle.emit(sage().id)"
    >
      <span class="top">
        <app-sage-avatar
          [icon]="sage().icon"
          [color]="sage().color"
          [size]="52"
          [state]="selected() ? 'selected' : 'idle'"
          [decorative]="true"
        />
        <span class="ident">
          <span class="name">{{ sage().name || 'Nom du sage' }}</span>
          <span class="meta">
            @switch (sage().origin) {
              @case ('base') { Sage de base }
              @case ('mine') { Par toi }
              @case ('library') { Par {{ sage().creator }} }
            }
            @if (sage().shared && sage().origin !== 'base') {
              <span class="badge shared"><app-icon name="share" [size]="12" />Partagé</span>
            }
          </span>
        </span>
      </span>
      <span class="desc">{{ sage().description || 'Sa description apparaîtra ici.' }}</span>
      <span class="foot">
        <span class="swatch"><span class="dot"></span>{{ colorLabel() }}</span>
        @if (sage().uses) {
          <span class="uses"><app-icon name="users" [size]="14" />{{ sage().uses!.toLocaleString('fr-FR') }}</span>
        }
        @if (!preview()) {
          <span class="state">
            @if (selected()) {
              <app-icon name="check" [size]="14" [stroke]="2.5" /> Dans le conseil
            } @else if (disabled()) {
              Conseil complet
            } @else {
              <app-icon name="plus" [size]="14" [stroke]="2.25" /> Ajouter
            }
          </span>
        }
      </span>
    </button>
  `,
  styles: `
    :host {
      display: block;
    }
    .card {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
      height: 100%;
      padding: 18px;
      text-align: left;
      border-radius: var(--r-lg);
      border: 1px solid var(--glass-border);
      background: var(--glass-2);
      box-shadow: inset 0 1px 0 var(--glass-highlight);
      transition:
        transform 220ms var(--ease),
        border-color 220ms,
        background-color 220ms,
        box-shadow 220ms;
    }
    .card:hover:not(:disabled):not(.is-static) {
      transform: translateY(-2px);
      border-color: color-mix(in srgb, var(--c) 45%, var(--glass-border));
    }
    .card.is-selected {
      border-color: var(--c);
      background:
        linear-gradient(160deg, color-mix(in srgb, var(--c) 16%, transparent), transparent 70%),
        var(--glass-2);
      box-shadow:
        0 0 0 1px var(--c),
        0 12px 32px -12px color-mix(in srgb, var(--c) 55%, transparent);
    }
    .card:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
    .card.is-static {
      cursor: default;
    }
    .top {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .ident {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }
    .name {
      font-family: var(--font-display);
      font-size: 19px;
      font-weight: 500;
      line-height: 1.2;
      color: var(--text);
      overflow-wrap: anywhere;
    }
    .meta {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      font-size: 13px;
      color: var(--text-3);
    }
    .shared {
      --c: var(--sage-cyan);
      height: 22px;
      font-size: 12px;
    }
    .desc {
      font-size: 14px;
      line-height: 1.5;
      color: var(--text-2);
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      overflow-wrap: anywhere;
    }
    .foot {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: auto;
      font-size: 13px;
      color: var(--text-3);
    }
    .swatch,
    .uses,
    .state {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--c);
    }
    .state {
      margin-left: auto;
      font-weight: 600;
      color: var(--text-2);
    }
    .is-selected .state {
      color: var(--c);
    }
  `,
})
export class SageCardComponent {
  readonly sage = input.required<Sage>();
  readonly selected = input(false);
  readonly disabled = input(false);
  readonly preview = input(false);
  readonly toggle = output<string>();

  protected readonly colorLabel = computed(
    () => SAGE_COLORS.find((c) => c.id === this.sage().color)?.label ?? '',
  );
}
