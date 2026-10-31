import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Stats } from '@/models/account.model';
import { DebateSummary } from '@/models/debate.model';
import { AccountApi } from '@/services/api/account.api';
import { apiErrorMessage } from '@/services/api/api-error';
import { DebatesApi } from '@/services/api/debates.api';
import { CouncilStore } from '@/services/council.store';
import { ModalComponent } from '@/ui/modal/modal.component';
import { TrendCardComponent } from '@/ui/trend-card/trend-card.component';
import { PromptInputComponent, PromptSubmission } from './components/prompt-input';
import { RecentDebatesComponent } from './components/recent-debates';
import { CustomizeCouncilComponent } from './customize-council/customize-council.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [RecentDebatesComponent, PromptInputComponent, TrendCardComponent, ModalComponent, CustomizeCouncilComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css',
})
export class DashboardPage {
  private readonly router = inject(Router);
  private readonly debates = inject(DebatesApi);
  private readonly account = inject(AccountApi);
  protected readonly store = inject(CouncilStore);

  protected readonly stats = signal<Stats | null>(null);
  /** Un débat continue même quand on quitte la salle : on doit pouvoir y retourner d'ici. */
  protected readonly recent = signal<DebateSummary[]>([]);
  protected readonly customizing = signal(false);
  protected readonly starting = signal(false);
  protected readonly error = signal('');

  constructor() {
    this.store.load();
    // Les tendances sont un plus : la page reste utilisable si elles ne se chargent pas.
    this.account.stats().subscribe({ next: (stats) => this.stats.set(stats), error: () => this.stats.set(null) });
    this.debates.list().subscribe({ next: (debates) => this.recent.set(debates), error: () => this.recent.set([]) });
  }

  protected start(submission: PromptSubmission): void {
    this.starting.set(true);
    this.error.set('');
    this.debates.create({ ...submission, sageIds: this.store.councilIds() }).subscribe({
      next: (debate) => void this.router.navigate(['/salle', debate.id]),
      error: (error: unknown) => {
        this.error.set(apiErrorMessage(error));
        this.starting.set(false);
      },
    });
  }
}
