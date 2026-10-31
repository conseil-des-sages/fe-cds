import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DebateSummary } from '@/models/debate.model';
import { IconComponent } from '@/ui/icon.component';

const MAX_SHOWN = 3;

/**
 * Les derniers débats, pour y retourner après avoir quitté la salle. Le serveur finit souvent bien avant
 * l'affichage : un débat quitté en pleine lecture peut déjà être terminé, il reste donc proposé.
 */
@Component({
  selector: 'app-recent-debates',
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="list" aria-label="Tes derniers débats">
      @for (debate of shown(); track debate.id) {
        <a class="cds-glass cds-glass--light row" [routerLink]="['/salle', debate.id]">
          <span class="text">
            <span class="cds-label">{{ debate.status === 'IN_PROGRESS' ? 'Débat en cours' : 'Débat terminé' }}</span>
            <span class="body title">{{ debate.title }}</span>
          </span>
          <span class="caption action">
            {{ debate.status === 'IN_PROGRESS' ? 'Reprendre' : 'Voir la synthèse' }}
            <app-icon name="arrow-right" [size]="16" />
          </span>
        </a>
      }
    </section>
  `,
  styles: `
    .list {
      display: grid;
      gap: var(--space-2);
    }
    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-4);
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-md);
      color: var(--ink);
      text-decoration: none;
      transition: background 0.15s var(--ease);
    }
    .row:hover {
      background: var(--glass-hover);
    }
    .text {
      display: grid;
      min-width: 0;
    }
    .title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .action {
      display: inline-flex;
      flex-shrink: 0;
      align-items: center;
      gap: var(--space-1);
      color: var(--accent-text);
    }
  `,
})
export class RecentDebatesComponent {
  readonly debates = input.required<DebateSummary[]>();
  protected readonly shown = computed(() =>
    this.debates().filter((debate) => debate.status !== 'ARCHIVED').slice(0, MAX_SHOWN),
  );
}
