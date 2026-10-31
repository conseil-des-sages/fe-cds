import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { ResponseLength, Sage, SageColor } from '../../data/models';
import { AI_MODELS, AVATAR_ICONS, DEFAULT_PROMPT, SAGE_COLORS } from '../../data/sages';
import { IconComponent } from '../../ui/icon.component';
import { SageCardComponent } from '../../ui/sage-card.component';

const DESC_MAX = 500;

@Component({
  selector: 'app-sage-form',
  imports: [IconComponent, SageCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="layout" (submit)="submit($event)" aria-label="Créer un sage">
      <div class="fields">
        <fieldset class="group">
          <legend class="legend">Identité</legend>

          <div class="field">
            <label class="label" for="sage-name">Nom</label>
            <input
              class="input"
              id="sage-name"
              maxlength="40"
              required
              placeholder="Le Coach"
              [value]="name()"
              (input)="name.set(val($event))"
            />
          </div>

          <div class="field">
            <div class="row">
              <label class="label" for="sage-desc">Description courte</label>
              <span class="hint" [class.warn]="descLeft() < 50" aria-live="polite">{{ description().length }} / {{ descMax }}</span>
            </div>
            <textarea
              class="textarea"
              id="sage-desc"
              rows="3"
              [attr.maxlength]="descMax"
              aria-describedby="sage-desc-hint"
              [value]="description()"
              (input)="description.set(val($event))"
            ></textarea>
            <span class="hint" id="sage-desc-hint">Affichée aux autres joueurs dans la bibliothèque.</span>
          </div>

          <fieldset class="field">
            <legend class="label">Couleur</legend>
            <div class="swatches" role="radiogroup" aria-label="Couleur du sage">
              @for (c of colors; track c.id) {
                <button
                  type="button"
                  role="radio"
                  class="swatch"
                  [style.--c]="'var(--sage-' + c.id + ')'"
                  [attr.aria-checked]="color() === c.id"
                  [attr.aria-label]="c.label"
                  [title]="c.label"
                  (click)="color.set(c.id)"
                >
                  @if (color() === c.id) {
                    <app-icon name="check" [size]="16" [stroke]="3" />
                  }
                </button>
              }
            </div>
          </fieldset>

          <fieldset class="field">
            <legend class="label">Avatar</legend>
            <div class="icons" role="radiogroup" aria-label="Icône de l’avatar">
              @for (i of icons; track i) {
                <button
                  type="button"
                  role="radio"
                  class="icon-opt"
                  [style.--c]="'var(--sage-' + color() + ')'"
                  [attr.aria-checked]="icon() === i"
                  [attr.aria-label]="i"
                  (click)="icon.set(i)"
                >
                  <app-icon [name]="i" [size]="22" />
                </button>
              }
            </div>
          </fieldset>
        </fieldset>

        <details class="advanced" [open]="advancedOpen()" (toggle)="advancedOpen.set(isOpen($event))">
          <summary>
            <span>
              <span class="adv-title">Réglages avancés</span>
              <span class="hint">Personnalité, modèle d’IA, style de réponse</span>
            </span>
            <app-icon name="chevron-down" class="chev" />
          </summary>

          <div class="adv-body">
            <div class="field">
              <label class="label" for="sage-prompt">Prompt système</label>
              <textarea
                class="textarea mono"
                id="sage-prompt"
                rows="7"
                [value]="prompt()"
                (input)="prompt.set(val($event))"
              ></textarea>
              <span class="hint">Décris sa personnalité, son rôle et ses limites. Le sage ne voit jamais les prompts des autres.</span>
            </div>

            <div class="field">
              <label class="label" for="sage-model">Modèle d’IA</label>
              <select class="select" id="sage-model" [value]="model()" (change)="model.set(val($event))">
                @for (m of models; track m.id) {
                  <option [value]="m.id">{{ m.label }}</option>
                }
              </select>
            </div>

            <div class="field">
              <div class="row">
                <label class="label" for="sage-temp">Température</label>
                <span class="temp-val">{{ temperature().toFixed(1) }} · {{ tempLabel() }}</span>
              </div>
              <input
                class="range"
                id="sage-temp"
                type="range"
                min="0"
                max="1"
                step="0.1"
                [value]="temperature()"
                [attr.aria-valuetext]="temperature().toFixed(1) + ', ' + tempLabel()"
                (input)="temperature.set(+val($event))"
              />
              <div class="range-ends" aria-hidden="true"><span>Prudent</span><span>Créatif</span></div>
            </div>

            <fieldset class="field">
              <legend class="label">Longueur des réponses</legend>
              <div class="segmented" role="radiogroup" aria-label="Longueur des réponses">
                @for (l of lengths; track l) {
                  <button type="button" role="radio" [attr.aria-checked]="length() === l" (click)="length.set(l)">
                    {{ l.charAt(0).toUpperCase() + l.slice(1) }}
                  </button>
                }
              </div>
            </fieldset>

            <div class="share">
              <span>
                <span class="label" id="share-label">Partager avec les autres joueurs</span>
                <span class="hint">Il apparaîtra dans la bibliothèque, avec ton pseudo.</span>
              </span>
              <button
                type="button"
                role="switch"
                class="switch"
                aria-labelledby="share-label"
                [attr.aria-checked]="shared()"
                (click)="shared.update(v => !v)"
              ></button>
            </div>
          </div>
        </details>
      </div>

      <aside class="preview" aria-label="Aperçu en direct">
        <p class="legend">Aperçu en direct</p>
        <app-sage-card [sage]="draft()" [preview]="true" />
        <p class="hint">C’est ainsi que les joueurs verront ton sage dans la bibliothèque.</p>
        <div class="actions">
          <button type="button" class="btn btn--ghost" (click)="cancel.emit()">Annuler</button>
          <button type="submit" class="btn btn--primary" [disabled]="!valid()">
            <app-icon name="check" [size]="18" />
            {{ initial() ? 'Enregistrer' : 'Créer le sage' }}
          </button>
        </div>
      </aside>
    </form>
  `,
  styles: `
    .layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 320px;
      gap: 32px;
      align-items: start;
    }
    .fields {
      display: flex;
      flex-direction: column;
      gap: 20px;
      min-width: 0;
    }
    .group {
      display: flex;
      flex-direction: column;
      gap: 20px;
      border: 0;
      padding: 0;
      margin: 0;
    }
    fieldset.field {
      border: 0;
      padding: 0;
      margin: 0;
    }
    .legend {
      font-family: var(--font-display);
      font-size: 20px;
      margin-bottom: 4px;
      padding: 0;
    }
    .row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 12px;
    }
    .warn {
      color: var(--brand-accent);
      font-weight: 600;
    }
    .swatches {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .swatch {
      display: grid;
      place-items: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--c);
      border: 2px solid transparent;
      color: var(--primary-fg);
      transition: transform 160ms var(--ease);
    }
    [data-theme='light'] .swatch {
      color: #fff;
    }
    .swatch:hover {
      transform: scale(1.08);
    }
    .swatch[aria-checked='true'] {
      box-shadow: 0 0 0 3px var(--bg-1), 0 0 0 5px var(--c);
    }
    .icons {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 8px;
    }
    .icon-opt {
      display: grid;
      place-items: center;
      aspect-ratio: 1;
      border-radius: 14px;
      border: 1px solid var(--glass-border);
      background: var(--glass-1);
      color: var(--text-2);
      transition: all 160ms;
    }
    .icon-opt:hover {
      color: var(--text);
      background: var(--glass-2);
    }
    .icon-opt[aria-checked='true'] {
      color: var(--c);
      border-color: var(--c);
      background: color-mix(in srgb, var(--c) 14%, transparent);
    }
    .advanced {
      border-radius: var(--r-lg);
      border: 1px solid var(--glass-border);
      background: var(--glass-1);
    }
    .advanced summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 16px 20px;
      cursor: pointer;
      list-style: none;
    }
    .advanced summary::-webkit-details-marker {
      display: none;
    }
    .advanced summary > span {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .adv-title {
      font-weight: 700;
    }
    .chev {
      transition: transform 220ms var(--ease);
    }
    .advanced[open] .chev {
      transform: rotate(180deg);
    }
    .adv-body {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 4px 20px 20px;
    }
    .mono {
      font-size: 14px;
      font-family: ui-monospace, 'SF Mono', Menlo, monospace;
    }
    .temp-val {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-2);
    }
    .range-ends {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: var(--text-3);
    }
    .share {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .share > span {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .preview {
      position: sticky;
      top: 0;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 8px;
    }
    @media (max-width: 860px) {
      .layout {
        grid-template-columns: 1fr;
      }
      .preview {
        position: static;
        order: -1;
      }
      .icons {
        grid-template-columns: repeat(6, 1fr);
      }
    }
  `,
})
export class SageFormComponent {
  readonly initial = input<Sage | null>(null);
  readonly save = output<Sage>();
  readonly cancel = output<void>();

  protected readonly colors = SAGE_COLORS;
  protected readonly icons = AVATAR_ICONS;
  protected readonly models = AI_MODELS;
  protected readonly lengths: ResponseLength[] = ['courtes', 'moyennes', 'longues'];
  protected readonly descMax = DESC_MAX;

  protected readonly name = signal('Le Coach');
  protected readonly description = signal(
    'Pousse à l’action : fixe des étapes concrètes et une date limite pour chaque option.',
  );
  protected readonly color = signal<SageColor>('ambre');
  protected readonly icon = signal('mountain');
  protected readonly prompt = signal(DEFAULT_PROMPT);
  protected readonly model = signal(AI_MODELS[0].id);
  protected readonly temperature = signal(0.6);
  protected readonly length = signal<ResponseLength>('moyennes');
  protected readonly shared = signal(true);
  protected readonly advancedOpen = signal(false);

  protected readonly descLeft = computed(() => DESC_MAX - this.description().length);
  protected readonly tempLabel = computed(() => {
    const t = this.temperature();
    return t < 0.35 ? 'prudent' : t > 0.65 ? 'créatif' : 'équilibré';
  });
  protected readonly valid = computed(() => this.name().trim().length >= 2 && this.description().trim().length > 0);

  protected readonly draft = computed<Sage>(() => {
    const name = this.name().trim();
    return {
      id: this.initial()?.id ?? 'draft',
      name,
      shortName: name.replace(/^(Le |La |L'|L’|Les )/, ''),
      description: this.description(),
      color: this.color(),
      icon: this.icon(),
      origin: 'mine',
      creator: 'Camille',
      shared: this.shared(),
      prompt: this.prompt(),
      model: this.model(),
      temperature: this.temperature(),
      length: this.length(),
    };
  });

  ngOnInit(): void {
    const s = this.initial();
    if (!s) return;
    this.name.set(s.name);
    this.description.set(s.description);
    this.color.set(s.color);
    this.icon.set(s.icon);
    this.prompt.set(s.prompt ?? DEFAULT_PROMPT.replace('Le Coach', s.name));
    this.model.set(s.model ?? AI_MODELS[0].id);
    this.temperature.set(s.temperature ?? 0.6);
    this.length.set(s.length ?? 'moyennes');
    this.shared.set(!!s.shared);
  }

  protected val(e: Event): string {
    return (e.target as HTMLInputElement).value;
  }

  protected isOpen(e: Event): boolean {
    return (e.target as HTMLDetailsElement).open;
  }

  protected submit(e: Event): void {
    e.preventDefault();
    if (!this.valid()) return;
    const d = this.draft();
    this.save.emit({ ...d, id: d.id === 'draft' ? `sage-${Date.now()}` : d.id });
  }
}
