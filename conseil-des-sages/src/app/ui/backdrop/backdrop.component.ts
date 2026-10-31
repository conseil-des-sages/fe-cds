import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Le fond de page : la couleur --bg et ses trois orbes flous (voir .cds-stage dans le kit). */
@Component({
  selector: 'app-backdrop',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'cds-stage', 'aria-hidden': 'true' },
  template: `<i class="cds-orb"></i>`,
  styles: `
    :host {
      position: fixed;
      inset: 0;
      z-index: -1;
    }
  `,
})
export class BackdropComponent {}
