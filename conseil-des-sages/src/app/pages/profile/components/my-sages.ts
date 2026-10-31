import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Sage } from '@/models/sage.model';
import { IconComponent } from '@/ui/icon.component';
import { SageCardComponent } from '@/ui/sage-card/sage-card.component';

@Component({
  selector: 'app-my-sages',
  imports: [IconComponent, SageCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section" aria-labelledby="my-sages-title">
      <div class="head">
        <h2 id="my-sages-title" class="heading-2">Mes sages</h2>
        <button type="button" class="cds-btn" (click)="create.emit()">
          <app-icon name="plus" [size]="16" /> Créer un sage
        </button>
      </div>
      <div class="grid">
        @for (sage of sages(); track sage.id) {
          <div class="item">
            <app-sage-card class="card" [sage]="sage" [preview]="true" />
            <div class="actions">
              <button type="button" class="cds-btn cds-btn--ghost cds-btn--sm" (click)="edit.emit(sage)">
                <app-icon name="pencil" [size]="16" /> Modifier
              </button>
              <button type="button" class="cds-btn cds-btn--ghost cds-btn--sm cds-btn--danger" (click)="remove.emit(sage)">
                <app-icon name="trash" [size]="16" /> Supprimer
              </button>
            </div>
          </div>
        } @empty {
          <p class="body empty">Crée un sage à ton image : il pourra siéger dans tous tes conseils.</p>
        }
      </div>
    </section>
  `,
  styles: `
    .section {
      display: grid;
      gap: var(--space-4);
    }
    h2, p {
      margin: 0;
    }
    .head {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-3);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: var(--space-4);
    }
    .item {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }
    .card {
      flex: 1;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
    }
    .empty {
      grid-column: 1 / -1;
      color: var(--ink-muted);
    }
  `,
})
export class MySagesComponent {
  readonly sages = input.required<Sage[]>();
  readonly create = output<void>();
  readonly edit = output<Sage>();
  readonly remove = output<Sage>();
}
