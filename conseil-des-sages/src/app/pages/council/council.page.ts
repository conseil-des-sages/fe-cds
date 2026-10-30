import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CouncilStore } from '../../services/council.store';
import { CouncilRingComponent } from '../../ui/council-ring.component';
import { StepProgressComponent } from '../../ui/step-progress.component';
import { InterventionBubbleComponent } from '../../ui/intervention-bubble.component';

@Component({
  selector: 'app-council-page',
  standalone: true,
  imports: [CouncilRingComponent, StepProgressComponent, InterventionBubbleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="council-page">
      <p class="eyebrow">Question soumise au conseil</p>
      <h1>{{ store.question() }}</h1>
      <section class="council-stage" aria-label="Débat en cours">
        <app-council-ring [sages]="store.council()" />
        <app-intervention-bubble [sage]="store.council()[0]" text="Commence par regarder ce qui est réversible. Une alternance à Lyon te donne de l'expérience concrète, tandis que le master à Paris garde davantage de portes ouvertes." />
      </section>
      <app-step-progress [current]="'ouverture'" />
    </main>
  `,
  styles: [`
    .council-page { min-height: calc(100vh - 92px); display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 7rem 2rem 2rem; text-align: center; }
    h1 { max-width: 760px; margin: 0; font-size: clamp(1.4rem, 2.5vw, 2.3rem); }
    .eyebrow { color: var(--text-3); text-transform: uppercase; letter-spacing: .12em; font-size: .7rem; margin: 0; }
    .council-stage { width: min(100%, 920px); flex: 1; min-height: 390px; display: grid; place-items: center; position: relative; }
    app-intervention-bubble { width: min(100%, 540px); position: absolute; z-index: 2; }
    app-council-ring { width: min(100%, 720px); }
    app-step-progress { width: min(100%, 700px); }
  `],
})
export class CouncilPage { protected readonly store = inject(CouncilStore); }
