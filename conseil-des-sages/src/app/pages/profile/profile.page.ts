import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DebateSummary } from '@/models/debate.model';
import { Profile } from '@/models/account.model';
import { Sage, SageDraft } from '@/models/sage.model';
import { AccountApi } from '@/services/api/account.api';
import { apiErrorMessage } from '@/services/api/api-error';
import { DebatesApi } from '@/services/api/debates.api';
import { CouncilStore } from '@/services/council.store';
import { ModalComponent } from '@/ui/modal/modal.component';
import { SageFormComponent } from '../dashboard/sage-form/sage-form.component';
import { DebateHistoryComponent } from './components/debate-history';
import { MySagesComponent } from './components/my-sages';
import { ProfileHeroComponent } from './components/profile-hero';

@Component({
  selector: 'app-profile-page',
  imports: [ProfileHeroComponent, DebateHistoryComponent, MySagesComponent, ModalComponent, SageFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile.page.html',
})
export class ProfilePage {
  private readonly account = inject(AccountApi);
  private readonly debatesApi = inject(DebatesApi);
  protected readonly store = inject(CouncilStore);

  protected readonly profile = signal<Profile | null>(null);
  protected readonly debates = signal<DebateSummary[] | null>(null);
  protected readonly failed = signal(false);
  protected readonly error = signal('');
  protected readonly editing = signal<Sage | 'new' | null>(null);
  protected readonly saving = signal(false);
  protected readonly editedSage = computed(() => {
    const editing = this.editing();
    return editing === 'new' ? null : editing;
  });

  constructor() {
    this.load();
  }

  protected load(): void {
    this.failed.set(false);
    this.store.load();
    this.account.profile().subscribe({ next: (profile) => this.profile.set(profile), error: () => this.failed.set(true) });
    this.debatesApi.list().subscribe({ next: (debates) => this.debates.set(debates), error: () => this.failed.set(true) });
  }

  protected rename(name: string): void {
    this.error.set('');
    this.account.rename(name).subscribe({
      next: (profile) => this.profile.set(profile),
      error: (error: unknown) => this.error.set(apiErrorMessage(error)),
    });
  }

  protected archive(debate: DebateSummary): void {
    this.error.set('');
    this.debatesApi.archive(debate.id, debate.status !== 'ARCHIVED').subscribe({
      next: (updated) => this.replaceDebate(updated),
      error: (error: unknown) => this.error.set(apiErrorMessage(error)),
    });
  }

  protected deleteDebate(debate: DebateSummary): void {
    this.error.set('');
    this.debatesApi.delete(debate.id).subscribe({
      next: () => this.debates.update((list) => (list ?? []).filter((other) => other.id !== debate.id)),
      error: (error: unknown) => this.error.set(apiErrorMessage(error)),
    });
  }

  protected saveSage(draft: SageDraft): void {
    const edited = this.editedSage();
    this.saving.set(true);
    this.error.set('');
    const request = edited ? this.store.updateSage(edited.id, draft) : this.store.createSage(draft);
    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.editing.set(null);
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.error.set(apiErrorMessage(error));
      },
    });
  }

  protected deleteSage(sage: Sage): void {
    this.error.set('');
    this.store.deleteSage(sage.id).subscribe({ error: (error: unknown) => this.error.set(apiErrorMessage(error)) });
  }

  private replaceDebate(updated: DebateSummary): void {
    this.debates.update((list) => (list ?? []).map((other) => (other.id === updated.id ? updated : other)));
  }
}
