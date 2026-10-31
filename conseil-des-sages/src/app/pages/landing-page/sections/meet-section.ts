import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LANDING_SAGES } from '@/data/landing';
import { SageCardComponent } from '@/ui/sage-card/sage-card.component';

@Component({
  selector: 'app-meet-section',
  imports: [SageCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section" aria-labelledby="meet-title">
      <div class="head">
        <h2 id="meet-title" class="display-l">Le conseil de base</h2>
        <p class="body text">Des regards qui ne seront jamais d’accord. Ajoute-en, retire-les, ou crée les tiens.</p>
      </div>
      <div class="grid">
        @for (sage of sages; track sage.id) {
          <app-sage-card [sage]="sage" [preview]="true" />
        }
      </div>
    </section>
  `,
  styles: `
    .section {
      display: grid;
      gap: var(--space-8);
    }
    h2, p {
      margin: 0;
    }
    .head {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      justify-content: space-between;
      gap: var(--space-4);
    }
    .text {
      max-width: 28rem;
      color: var(--ink-muted);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: var(--space-4);
    }
  `,
})
export class MeetSection {
  protected readonly sages = LANDING_SAGES;
}
