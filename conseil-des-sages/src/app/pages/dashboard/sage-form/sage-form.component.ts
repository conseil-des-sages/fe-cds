import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { LlmModel } from '@/models/account.model';
import { AVATAR_ICONS, SAGE_COLORS, Sage, SageColor, SageDraft } from '@/models/sage.model';
import { IconComponent } from '@/ui/icon.component';
import { SageCardComponent } from '@/ui/sage-card/sage-card.component';

const DESCRIPTION_MAX = 500;
const LENGTHS = [
  { label: 'Courtes', tokens: 300 },
  { label: 'Moyennes', tokens: 600 },
  { label: 'Longues', tokens: 1000 },
];
const DEFAULT_PROMPT =
  'Tu es un sage du Conseil. Décris ici sa personnalité, son rôle et ses limites : comment il raisonne, ce qui compte pour lui, ce qu’il ne fait jamais.';

/** Création ou modification d'un sage, avec son aperçu en direct. */
@Component({
  selector: 'app-sage-form',
  imports: [IconComponent, SageCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sage-form.component.html',
  styleUrl: './sage-form.component.css',
})
export class SageFormComponent implements OnInit {
  readonly initial = input<Sage | null>(null);
  readonly models = input.required<LlmModel[]>();
  readonly saving = input(false);
  readonly saved = output<SageDraft>();
  readonly cancelled = output<void>();

  protected readonly colors = SAGE_COLORS;
  protected readonly icons = AVATAR_ICONS;
  protected readonly lengths = LENGTHS;
  protected readonly descriptionMax = DESCRIPTION_MAX;

  protected readonly name = signal('');
  protected readonly description = signal('');
  protected readonly color = signal<SageColor>('cyan');
  protected readonly icon = signal('compass');
  protected readonly prompt = signal(DEFAULT_PROMPT);
  protected readonly model = signal('');
  protected readonly temperature = signal(0.6);
  protected readonly maxTokens = signal(600);
  protected readonly shared = signal(false);

  protected readonly temperatureLabel = computed(() => {
    const value = this.temperature();
    return value < 0.35 ? 'posé' : value > 0.65 ? 'créatif' : 'équilibré';
  });
  protected readonly valid = computed(
    () => this.name().trim().length >= 2 && this.description().trim().length > 0 && this.prompt().trim().length >= 10,
  );
  protected readonly preview = computed<Sage>(() => {
    const name = this.name().trim();
    return {
      id: this.initial()?.id ?? 0,
      name,
      shortName: name,
      description: this.description(),
      color: this.color(),
      icon: this.icon(),
      origin: 'mine',
      creator: null,
      shared: this.shared(),
      inDefaultCouncil: false,
      uses: 0,
      prompt: null,
      model: null,
      temperature: null,
      maxTokens: null,
    };
  });

  ngOnInit(): void {
    const sage = this.initial();
    this.model.set(this.models().find((model) => model.available)?.id ?? this.models()[0]?.id ?? '');
    if (!sage) return;
    this.name.set(sage.name);
    this.description.set(sage.description);
    this.color.set(sage.color);
    this.icon.set(sage.icon);
    this.prompt.set(sage.prompt ?? DEFAULT_PROMPT);
    this.model.set(sage.model ?? this.model());
    this.temperature.set(sage.temperature ?? 0.6);
    this.maxTokens.set(sage.maxTokens ?? 600);
    this.shared.set(sage.shared);
  }

  protected value(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  protected submit(event: Event): void {
    event.preventDefault();
    if (!this.valid() || this.saving()) return;
    this.saved.emit({
      name: this.name().trim(),
      description: this.description().trim(),
      prompt: this.prompt().trim(),
      model: this.model(),
      temperature: this.temperature(),
      maxTokens: this.maxTokens(),
      color: this.color(),
      icon: this.icon(),
      shared: this.shared(),
    });
  }
}
