import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Stats } from '@/models/account.model';

/** La carte flottante du dashboard : les débats menés et les thèmes les plus fréquents. */
@Component({
  selector: 'app-trend-card',
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="cds-glass cds-glass--light card" aria-label="Tendances du conseil">
      <div class="cds-label">Débats menés</div>
      <div class="cds-metric figure">{{ stats().totalDebates | number: '1.0-0' : 'fr' }}</div>
      <div class="caption week">+ {{ stats().debatesThisWeek | number: '1.0-0' : 'fr' }} cette semaine</div>
      @if (stats().themes.length) {
        <div class="separator"></div>
        <div class="cds-label">Tendances</div>
        <div class="chips">
          @for (theme of stats().themes; track theme) {
            <span class="cds-chip">{{ theme }}</span>
          }
        </div>
      }
    </aside>
  `,
  styleUrl: './trend-card.component.css',
})
export class TrendCardComponent {
  readonly stats = input.required<Stats>();
}
