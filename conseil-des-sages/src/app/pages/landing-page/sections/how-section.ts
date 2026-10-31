import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LANDING_STEPS } from '@/data/landing';
import { IconComponent } from '@/ui/icon.component';

@Component({
  selector: 'app-how-section',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="comment-ca-marche" class="section" aria-labelledby="how-title">
      <h2 id="how-title" class="display-l">Comment ça marche</h2>
      <ol class="grid">
        @for (step of steps; track step.title; let index = $index) {
          <li class="cds-glass cds-glass--strong card">
            <div class="top">
              <app-icon [name]="step.icon" [size]="24" />
              <span class="cds-label">Étape {{ index + 1 }}</span>
            </div>
            <h3 class="heading-2">{{ step.title }}</h3>
            <p class="body text">{{ step.text }}</p>
            <p class="caption example">{{ step.example }}</p>
          </li>
        }
      </ol>
    </section>
  `,
  styleUrl: './how-section.css',
})
export class HowSection {
  protected readonly steps = LANDING_STEPS;
}
