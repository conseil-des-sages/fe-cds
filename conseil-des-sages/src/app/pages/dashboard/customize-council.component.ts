import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { Sage, SageOrigin } from '../../data/models';
import { BASE_SAGES, LIBRARY_SAGES } from '../../data/sages';
import { COUNCIL_SIZE, CouncilStore } from '../../services/council.store';
import { IconComponent } from '../../ui/icon.component';
import { SageAvatarComponent } from '../../ui/sage-avatar.component';
import { SageCardComponent } from '../../ui/sage-card.component';
import { SageFormComponent } from './sage-form.component';

const FILTERS: { id: SageOrigin; label: string }[] = [
  { id: 'base', label: 'Sages de base' },
  { id: 'mine', label: 'Mes sages' },
  { id: 'library', label: 'Bibliothèque' },
];

/** Content of the "Personnaliser le conseil" dialog. View: grid of sages, or the create form. */
@Component({
  selector: 'app-customize-council',
  imports: [IconComponent, SageAvatarComponent, SageCardComponent, SageFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="panel glass glass--solid">
      <header class="head">
        @if (view() === 'form') {
          <button type="button" class="btn btn--ghost btn--icon" aria-label="Retour aux sages" (click)="view.set('grid')">
            <app-icon name="arrow-left" />
          </button>
        }
        <div class="titles">
          <h2 id="customize-title">{{ view() === 'grid' ? 'Personnaliser le conseil' : 'Créer un sage' }}</h2>
          <p class="sub">
            {{ view() === 'grid' ? 'Choisis les cinq voix qui débattront de ta décision.' : 'Donne-lui une identité, puis affine sa personnalité.' }}
          </p>
        </div>
        <button type="button" class="btn btn--ghost btn--icon close" aria-label="Fermer" (click)="close.emit()">
          <app-icon name="x" />
        </button>
      </header>

      @if (view() === 'grid') {
        <div class="toolbar">
          <div class="segmented" role="tablist" aria-label="Filtrer les sages">
            @for (f of filters; track f.id) {
              <button type="button" role="tab" [attr.aria-selected]="filter() === f.id" (click)="filter.set(f.id)">
                {{ f.label }}
                <span class="count">{{ countFor(f.id) }}</span>
              </button>
            }
          </div>
          <div class="search">
            <app-icon name="search" [size]="18" class="search-ic" />
            <label class="sr-only" for="sage-search">Rechercher un sage</label>
            <input
              id="sage-search"
              class="input"
              type="search"
              placeholder="Rechercher un sage ou un créateur"
              [value]="query()"
              (input)="query.set($any($event.target).value)"
            />
          </div>
          <button type="button" class="btn btn--glass create" (click)="view.set('form')">
            <app-icon name="plus" [size]="18" />
            Créer un sage
          </button>
        </div>

        <div class="body scroll-y">
          <div class="grid" role="tabpanel">
            @for (s of visible(); track s.id) {
              <app-sage-card
                [sage]="s"
                [selected]="draft().includes(s.id)"
                [disabled]="draft().length >= size"
                (toggle)="toggle($event)"
              />
            } @empty {
              <div class="empty">
                <p>Aucun sage ne correspond à « {{ query() }} ».</p>
              </div>
            }
          </div>
        </div>

        <footer class="foot">
          <div class="composition">
            <p class="comp-label">
              Ton conseil <strong>{{ draft().length }}/{{ size }}</strong>
            </p>
            <ul class="slots" aria-label="Conseil composé">
              @for (slot of slots(); track $index) {
                <li>
                  @if (slot) {
                    <button type="button" class="slot" [attr.aria-label]="'Retirer ' + slot.name" (click)="toggle(slot.id)">
                      <app-sage-avatar [icon]="slot.icon" [color]="slot.color" [size]="44" [decorative]="true" />
                      <span class="slot-x"><app-icon name="x" [size]="10" [stroke]="3" /></span>
                    </button>
                    <span class="slot-name">{{ slot.shortName }}</span>
                  } @else {
                    <span class="slot empty-slot" aria-label="Siège libre"><app-icon name="plus" [size]="16" /></span>
                    <span class="slot-name muted">Libre</span>
                  }
                </li>
              }
            </ul>
          </div>
          <div class="foot-actions">
            <button type="button" class="btn btn--ghost" (click)="draft.set(baseIds)">Réinitialiser</button>
            <button type="button" class="btn btn--primary" [disabled]="draft().length !== size" (click)="confirm()">
              Valider le conseil
            </button>
          </div>
        </footer>
      } @else {
        <div class="body scroll-y form-body">
          <app-sage-form (save)="created($event)" (cancel)="view.set('grid')" />
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .panel {
      display: flex;
      flex-direction: column;
      width: min(1080px, calc(100vw - 32px));
      height: min(820px, calc(100dvh - 32px));
      border-radius: var(--r-xl);
      overflow: hidden;
    }
    .head {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 28px 28px 16px;
    }
    .titles {
      flex: 1;
      min-width: 0;
    }
    h2 {
      font-size: 30px;
    }
    .sub {
      color: var(--text-2);
      margin-top: 4px;
    }
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      padding: 0 28px 16px;
    }
    .count {
      margin-left: 6px;
      font-size: 12px;
      opacity: 0.75;
    }
    .search {
      position: relative;
      flex: 1;
      min-width: 200px;
    }
    .search .input {
      min-height: 44px;
      padding-left: 42px;
      border-radius: var(--r-pill);
    }
    .search-ic {
      position: absolute;
      left: 16px;
      top: 13px;
      color: var(--text-3);
    }
    .body {
      flex: 1;
      min-height: 0;
      padding: 8px 28px 24px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
      gap: 14px;
    }
    .empty {
      grid-column: 1 / -1;
      padding: 48px;
      text-align: center;
      color: var(--text-2);
    }
    .foot {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 16px 28px 22px;
      border-top: 1px solid var(--glass-border);
      background: var(--glass-1);
    }
    .composition {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .comp-label {
      font-size: 14px;
      color: var(--text-2);
      white-space: nowrap;
    }
    .comp-label strong {
      display: block;
      font-family: var(--font-display);
      font-size: 24px;
      font-weight: 500;
      color: var(--text);
    }
    .slots {
      display: flex;
      gap: 12px;
    }
    .slots li {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      width: 60px;
    }
    .slot {
      position: relative;
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      background: none;
    }
    .slot-x {
      position: absolute;
      top: -3px;
      right: -3px;
      display: grid;
      place-items: center;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--primary);
      color: var(--primary-fg);
      opacity: 0;
      transition: opacity 160ms;
    }
    .slot:hover .slot-x,
    .slot:focus-visible .slot-x {
      opacity: 1;
    }
    .empty-slot {
      border: 1.5px dashed var(--glass-border-strong);
      color: var(--text-3);
    }
    .slot-name {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-2);
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .muted {
      color: var(--text-3);
      font-weight: 400;
    }
    .foot-actions {
      display: flex;
      gap: 8px;
      margin-left: auto;
    }
    .form-body {
      padding-top: 4px;
    }
    @media (max-width: 720px) {
      .panel {
        width: 100vw;
        height: 100dvh;
        border-radius: 0;
      }
      .head, .toolbar, .body, .foot {
        padding-left: 16px;
        padding-right: 16px;
      }
      h2 { font-size: 24px; }
      .segmented { width: 100%; overflow-x: auto; }
      .segmented button { flex: 1; white-space: nowrap; padding: 0 10px; }
      .create { width: 100%; }
      .composition { flex-direction: column; align-items: flex-start; gap: 8px; width: 100%; }
      .comp-label strong { display: inline; font-size: 18px; margin-left: 4px; }
      .slots { gap: 4px; width: 100%; justify-content: space-between; }
      .foot-actions { width: 100%; }
      .foot-actions .btn { flex: 1; }
    }
  `,
})
export class CustomizeCouncilComponent {
  private readonly store = inject(CouncilStore);
  readonly initialFilter = input<SageOrigin>('base');
  readonly close = output<void>();

  protected readonly filters = FILTERS;
  protected readonly size = COUNCIL_SIZE;
  protected readonly baseIds = BASE_SAGES.map((s) => s.id);

  protected readonly view = signal<'grid' | 'form'>('grid');
  protected readonly filter = signal<SageOrigin>('base');
  protected readonly query = signal('');
  protected readonly draft = signal<string[]>(this.store.councilIds());

  private readonly pool = computed<Record<SageOrigin, Sage[]>>(() => ({
    base: BASE_SAGES,
    mine: this.store.mySages(),
    library: LIBRARY_SAGES,
  }));

  protected readonly visible = computed(() => {
    const q = this.query().trim().toLowerCase();
    const list = this.pool()[this.filter()];
    if (!q) return list;
    return list.filter((s) =>
      [s.name, s.description, s.creator ?? ''].some((v) => v.toLowerCase().includes(q)),
    );
  });

  protected readonly slots = computed(() => {
    const picked = this.draft().map((id) => this.store.sage(id) ?? null);
    return Array.from({ length: COUNCIL_SIZE }, (_, i) => picked[i] ?? null);
  });

  readonly initialView = input<'grid' | 'form'>('grid');

  ngOnInit(): void {
    this.filter.set(this.initialFilter());
    this.view.set(this.initialView());
  }

  protected countFor(origin: SageOrigin): number {
    return this.pool()[origin].length;
  }

  protected toggle(id: string): void {
    this.draft.update((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : ids.length < COUNCIL_SIZE ? [...ids, id] : ids,
    );
  }

  protected created(sage: Sage): void {
    this.store.saveSage(sage);
    this.filter.set('mine');
    this.query.set('');
    this.view.set('grid');
    if (this.draft().length < COUNCIL_SIZE) this.draft.update((ids) => [...ids, sage.id]);
  }

  protected confirm(): void {
    this.store.councilIds.set(this.draft());
    this.close.emit();
  }
}
