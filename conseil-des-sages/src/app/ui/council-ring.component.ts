import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AvatarState, Sage } from '../data/models';
import { SageAvatarComponent } from './sage-avatar.component';

/**
 * The round table: sages placed on an ellipse, with projected content in the middle.
 * Positions are percentages, so the ring scales with its container.
 */
@Component({
  selector: 'app-council-ring',
  imports: [SageAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.--avatar.px]': 'avatarSize()' },
  template: `
    <span class="table" [style.inset]="tableInset()" aria-hidden="true"></span>
    <ul class="seats" [attr.aria-label]="label()">
      @for (seat of seats(); track seat.sage.id) {
        <li class="seat" [style.left.%]="seat.x" [style.top.%]="seat.y" [attr.data-state]="seat.state">
          <app-sage-avatar
            [icon]="seat.sage.icon"
            [color]="seat.sage.color"
            [name]="seat.sage.name"
            [size]="avatarSize()"
            [state]="seat.state"
            [decorative]="showLabels()"
          />
          @if (showLabels()) {
            <span class="name" [style.--c]="'var(--sage-' + seat.sage.color + ')'">
              {{ seat.sage.name }}
              @if (seat.state === 'speaking') {
                <span class="sr-only">— parle</span>
              } @else if (seat.state === 'thinking') {
                <span class="sr-only">— réfléchit</span>
              }
            </span>
          }
        </li>
      }
    </ul>
    <div class="center"><ng-content /></div>
  `,
  styles: `
    :host {
      position: relative;
      display: block;
    }
    .table {
      position: absolute;
      background: radial-gradient(closest-side, color-mix(in srgb, var(--text) 4%, transparent), transparent);
      pointer-events: none;
    }
    .seats {
      position: absolute;
      inset: 0;
      z-index: 2;
      pointer-events: none;
    }
    .seat {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      transform: translate(-50%, calc(var(--avatar) / -2));
      pointer-events: auto;
    }
    .name {
      padding: 4px 12px;
      border-radius: var(--r-pill);
      font-size: 14px;
      font-weight: 600;
      white-space: nowrap;
      color: var(--text);
      background: var(--glass-3);
      border: 1px solid var(--glass-border);
      transition: opacity 400ms, color 300ms;
    }
    .seat[data-state='speaking'] .name {
      color: var(--c);
      border-color: color-mix(in srgb, var(--c) 50%, transparent);
    }
    .seat[data-state='dimmed'] .name {
      opacity: 0.6;
    }
    .center {
      position: absolute;
      inset: 0;
      z-index: 1;
      display: grid;
      place-items: center;
      pointer-events: none;
    }
    .center > ::ng-deep * {
      pointer-events: auto;
    }
  `,
})
export class CouncilRingComponent {
  readonly sages = input.required<Sage[]>();
  readonly activeId = input<string | null>(null);
  readonly thinkingId = input<string | null>(null);
  readonly avatarSize = input(64);
  readonly showLabels = input(true);
  /** Ellipse radii, in % of the container */
  readonly rx = input(42);
  readonly ry = input(40);
  readonly label = input('Le conseil');

  protected readonly tableInset = computed(
    () => `${50 - this.ry()}% ${50 - this.rx()}%`,
  );

  protected readonly seats = computed(() => {
    const list = this.sages();
    const active = this.activeId();
    const thinking = this.thinkingId();
    return list.map((sage, i) => {
      const angle = ((-90 + (360 / list.length) * i) * Math.PI) / 180;
      let state: AvatarState = 'idle';
      if (active) state = sage.id === active ? 'speaking' : 'dimmed';
      if (sage.id === thinking) state = 'thinking';
      return {
        sage,
        state,
        x: 50 + this.rx() * Math.cos(angle),
        y: 50 + this.ry() * Math.sin(angle),
      };
    });
  });
}
