import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Sage } from '../data/models';
import { IconComponent } from './icon.component';
import { SageAvatarComponent } from './sage-avatar.component';

/**
 * Intervention bubble. Variants: live (large, in the centre of the circle) and compact (history).
 * States: thinking (no text yet) · typing (caret) · done.
 */
@Component({
  selector: 'app-intervention-bubble',
  imports: [SageAvatarComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.compact]': 'compact()',
    '[style.--c]': '"var(--sage-" + sage().color + ")"',
  },
  template: `
    <header class="head">
      <app-sage-avatar
        [icon]="sage().icon"
        [color]="sage().color"
        [size]="compact() ? 30 : 38"
        [decorative]="true"
        [state]="thinking() ? 'thinking' : 'idle'"
      />
      <div class="who">
        <span class="name">{{ sage().name }}</span>
        @if (repliesTo()) {
          <span class="reply"><app-icon name="reply" [size]="14" />répond {{ repliesTo() }}</span>
        }
      </div>
      @if (stepLabel()) {
        <span class="step">{{ stepLabel() }}</span>
      }
    </header>
    @if (thinking()) {
      <p class="body thinking">
        <span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
        {{ sage().shortName }} réfléchit…
      </p>
    } @else {
      <p class="body" [class.question]="question()">
        {{ text() }}@if (typing()) {<span class="caret" aria-hidden="true"></span>}
      </p>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 14px;
      min-width: 0;
    }
    .head {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .who {
      display: flex;
      flex-direction: column;
      min-width: 0;
      gap: 2px;
    }
    .name {
      font-family: var(--font-display);
      font-size: 20px;
      font-weight: 500;
      line-height: 1.2;
      color: var(--c);
    }
    .reply {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: var(--text-2);
    }
    .step {
      margin-left: auto;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--text-3);
      white-space: nowrap;
    }
    .body {
      font-size: 17px;
      line-height: 1.62;
      color: var(--text);
    }
    .body.question {
      font-weight: 500;
    }
    .thinking {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--text-2);
      font-size: 16px;
    }
    .dots {
      display: inline-flex;
      gap: 5px;
    }
    .dots i {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--c);
      animation: dot 1.2s ease-in-out infinite;
    }
    .dots i:nth-child(2) { animation-delay: 0.15s; }
    .dots i:nth-child(3) { animation-delay: 0.3s; }
    .caret {
      display: inline-block;
      width: 2px;
      height: 1.1em;
      margin-left: 2px;
      vertical-align: -0.15em;
      background: var(--c);
      animation: blink 1s steps(2) infinite;
    }
    :host(.compact) {
      gap: 8px;
    }
    :host(.compact) .name {
      font-size: 16px;
    }
    :host(.compact) .reply {
      font-size: 13px;
    }
    :host(.compact) .body {
      font-size: 15px;
      line-height: 1.55;
      color: var(--text-2);
    }
    @keyframes dot {
      0%, 80%, 100% { opacity: 0.3; transform: translateY(0); }
      40% { opacity: 1; transform: translateY(-3px); }
    }
    @keyframes blink {
      to { opacity: 0; }
    }
  `,
})
export class InterventionBubbleComponent {
  readonly sage = input.required<Sage>();
  readonly text = input<string>('');
  readonly repliesTo = input<string | undefined>(undefined);
  readonly stepLabel = input<string>('');
  readonly typing = input(false);
  readonly thinking = input(false);
  readonly question = input(false);
  readonly compact = input(false);
}
