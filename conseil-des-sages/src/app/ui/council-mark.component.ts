import { ChangeDetectionStrategy, Component, input } from '@angular/core';

const SEATS = ['bleu', 'orange', 'vert', 'rouge', 'violet'];

/** Logo: a round table with five seats, one per base sage colour. */
@Component({
  selector: 'app-council-mark',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', '[style.--s.px]': 'size()' },
  template: `
    <span class="table"></span>
    @for (c of seats; track c; let i = $index) {
      <span class="seat" [style.--c]="'var(--sage-' + c + ')'" [style.--a.deg]="i * 72 - 90"></span>
    }
  `,
  styles: `
    :host {
      position: relative;
      display: inline-block;
      flex-shrink: 0;
      width: var(--s);
      height: var(--s);
    }
    .table {
      position: absolute;
      inset: 22%;
      border-radius: 50%;
      border: 1.5px solid color-mix(in srgb, var(--text) 55%, transparent);
    }
    .seat {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 20%;
      height: 20%;
      margin: -10% 0 0 -10%;
      border-radius: 50%;
      background: var(--c);
      transform: rotate(var(--a)) translateX(calc(var(--s) * 0.4)) rotate(calc(var(--a) * -1));
    }
  `,
})
export class CouncilMarkComponent {
  readonly size = input(32);
  protected readonly seats = SEATS;
}
