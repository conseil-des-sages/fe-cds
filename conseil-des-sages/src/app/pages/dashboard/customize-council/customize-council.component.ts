import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { Sage, SageDraft, SageOrigin } from '@/models/sage.model';
import { apiErrorMessage } from '@/services/api/api-error';
import { CouncilStore } from '@/services/council.store';
import { SageFormComponent } from '../sage-form/sage-form.component';
import { CouncilSlotsComponent } from './council-slots';
import { SagePickerComponent } from './sage-picker';

/** Le contenu de la popup « Personnaliser le conseil » : le choix des sages, ou leur création. */
@Component({
  selector: 'app-customize-council',
  imports: [SagePickerComponent, CouncilSlotsComponent, SageFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './customize-council.component.html',
  styleUrl: './customize-council.component.css',
})
export class CustomizeCouncilComponent {
  protected readonly store = inject(CouncilStore);
  readonly done = output<void>();

  protected readonly draft = signal<number[]>(this.store.councilIds());
  protected readonly editing = signal<Sage | 'new' | null>(null);
  protected readonly filter = signal<SageOrigin>('base');
  protected readonly saving = signal(false);
  protected readonly error = signal('');

  protected readonly selected = computed(() => {
    const byId = new Map(this.store.sages().map((sage) => [sage.id, sage]));
    return this.draft()
      .map((id) => byId.get(id))
      .filter((sage): sage is Sage => !!sage);
  });
  protected readonly tooFew = computed(() => this.draft().length < this.store.minSages());
  protected readonly editedSage = computed(() => {
    const editing = this.editing();
    return editing === 'new' ? null : editing;
  });

  protected toggle(id: number): void {
    const ids = this.draft();
    if (ids.includes(id)) this.compose(ids.filter((other) => other !== id));
    else if (ids.length < this.store.maxSages()) this.compose([...ids, id]);
  }

  protected reset(): void {
    this.compose(this.store.sages().filter((sage) => sage.inDefaultCouncil).map((sage) => sage.id));
  }

  /** Chaque changement s'enregistre : fermer la popup, de n'importe quelle façon, ne perd rien. */
  private compose(ids: number[]): void {
    this.draft.set(ids);
    if (!this.tooFew()) {
      this.store.saveCouncil(ids);
    }
  }

  protected save(draft: SageDraft): void {
    const edited = this.editedSage();
    this.saving.set(true);
    this.error.set('');
    const request = edited ? this.store.updateSage(edited.id, draft) : this.store.createSage(draft);
    request.subscribe({
      next: (sage) => {
        this.saving.set(false);
        this.editing.set(null);
        this.filter.set('mine');
        if (!edited && this.draft().length < this.store.maxSages()) {
          this.compose([...this.draft(), sage.id]);
        }
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.error.set(apiErrorMessage(error));
      },
    });
  }

  protected remove(sage: Sage): void {
    this.error.set('');
    this.store.deleteSage(sage.id).subscribe({
      next: () => this.compose(this.draft().filter((other) => other !== sage.id)),
      error: (error: unknown) => this.error.set(apiErrorMessage(error)),
    });
  }
}
