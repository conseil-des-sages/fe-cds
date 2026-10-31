import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BASE_SAGES } from '../../data/sages';
import { SageCardComponent } from '../../ui/sage-card.component';

@Component({
  selector: 'app-design-system-page',
  standalone: true,
  imports: [SageCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<main class="showcase"><p class="eyebrow">Le Conseil des Sages</p><h1>Design system</h1><p>Palette et composants de référence.</p><div class="grid">@for (sage of sages; track sage.id) { <app-sage-card [sage]="sage" /> }</div></main>`,
  styles: [`.showcase{max-width:1000px;margin:auto;padding:7rem 2rem 3rem}.eyebrow{color:var(--text-3);text-transform:uppercase;letter-spacing:.12em;font-size:.7rem}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-top:2rem}@media(max-width:700px){.grid{grid-template-columns:1fr}}`],
})
export class DesignSystemPage { protected readonly sages = BASE_SAGES; }
