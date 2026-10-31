import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LANDING_SAGES } from '@/data/landing';
import { CouncilRingComponent } from '@/ui/council-ring/council-ring.component';
import { IconComponent } from '@/ui/icon.component';
import { InterventionPanelComponent } from '@/ui/intervention-panel/intervention-panel.component';
import { SageCardComponent } from '@/ui/sage-card/sage-card.component';
import { ProgressStep, StepProgressComponent } from '@/ui/step-progress/step-progress.component';
import { TrendCardComponent } from '@/ui/trend-card/trend-card.component';

const COLOR_TOKENS = ['bg', 'ink', 'ink-muted', 'ink-subtle', 'accent', 'accent-text', 'info', 'success', 'warning', 'danger'];
const TEXT_STYLES = ['display-l', 'heading-1', 'heading-2', 'heading-3', 'body-l', 'body', 'caption'];

/** Vitrine de référence : les tokens et composants tels qu'ils sont réellement implémentés. */
@Component({
  selector: 'app-design-system-page',
  imports: [CouncilRingComponent, IconComponent, InterventionPanelComponent, SageCardComponent, StepProgressComponent, TrendCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './design-system.page.html',
  styleUrl: './design-system.page.css',
})
export class DesignSystemPage {
  protected readonly sages = LANDING_SAGES;
  protected readonly colors = COLOR_TOKENS;
  protected readonly textStyles = TEXT_STYLES;
  protected readonly stats = { totalDebates: 12480, debatesThisWeek: 320, themes: ['Études', 'Logement', 'Emploi'] };
  protected readonly steps: ProgressStep[] = [
    { id: 1, label: 'Ouverture', state: 'done' },
    { id: 2, label: 'Confrontation', state: 'active' },
    { id: 3, label: 'Position finale', state: 'upcoming' },
    { id: 4, label: 'Synthèse', state: 'upcoming' },
  ];
}
