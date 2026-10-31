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
      <header class="question-head">
        <p class="eyebrow">Question soumise au conseil</p>
        <h1>{{ store.question() || 'Quel dilemme souhaites-tu explorer ?' }}</h1>
      </header>
      <section class="debate" aria-label="Débat en cours">
        <div class="council-stage">
          <app-council-ring [sages]="store.council()" [avatarSize]="56" [rx]="39" [ry]="37" />
        </div>
        @if (store.council().length) {
          <article class="intervention glass">
            <app-intervention-bubble [sage]="store.council()[0]" text="Commence par regarder ce qui est réversible. Une alternance à Lyon te donne de l'expérience concrète, tandis que le master à Paris garde davantage de portes ouvertes." />
          </article>
        }
      </section>
      <app-step-progress [current]="'ouverture'" />
    </main>
  `,
  styles: [`
    .council-page { width: min(100% - 2rem, 1040px); min-height: calc(100dvh - 92px); margin-inline: auto; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; gap: 1.25rem; padding: clamp(2rem, 6vh, 4.5rem) 0 2.5rem; }
    .question-head { width: min(100%, 760px); text-align: center; }
    h1 { margin: .4rem 0 0; font-size: clamp(1.45rem, 3vw, 2.35rem); line-height: 1.2; text-wrap: balance; }
    .eyebrow { color: var(--text-3); text-transform: uppercase; letter-spacing: .12em; font-size: .7rem; margin: 0; }
    .debate { width: min(100%, 800px); display: grid; justify-items: center; gap: .5rem; }
    .council-stage { width: min(100%, 680px); aspect-ratio: 1.8; min-height: 260px; max-height: 390px; position: relative; }
    app-council-ring { position: absolute; inset: 0; }
    .intervention { position: relative; z-index: 3; width: min(100% - 1rem, 620px); box-sizing: border-box; padding: clamp(1rem, 3vw, 1.5rem); text-align: left; }
    app-step-progress { width: min(100%, 700px); margin-top: auto; }
    @media (max-width: 600px) {
      .council-page { width: min(100% - 1.25rem, 1040px); min-height: calc(100dvh - 72px); gap: 1rem; padding-top: 1.5rem; }
      .council-stage { aspect-ratio: 1.45; min-height: 220px; max-height: 300px; }
      .intervention { width: 100%; }
    }
  `],
})
export class CouncilPage { protected readonly store = inject(CouncilStore); }
