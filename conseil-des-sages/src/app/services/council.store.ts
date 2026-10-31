import { Injectable, computed, inject, signal } from '@angular/core';
import { EMPTY, Observable, Subject, catchError, concatMap, forkJoin, tap } from 'rxjs';
import { LlmModel } from '@/models/account.model';
import { Sage, SageDraft } from '@/models/sage.model';
import { AccountApi } from './api/account.api';
import { SagesApi } from './api/sages.api';

export type LoadState = 'loading' | 'ready' | 'error';

/** Les sages disponibles et le conseil composé par le joueur. */
@Injectable({ providedIn: 'root' })
export class CouncilStore {
  private readonly sagesApi = inject(SagesApi);
  private readonly accountApi = inject(AccountApi);

  readonly state = signal<LoadState>('loading');
  readonly sages = signal<Sage[]>([]);
  readonly councilIds = signal<number[]>([]);
  readonly models = signal<LlmModel[]>([]);
  readonly minSages = signal(2);
  readonly maxSages = signal(8);
  readonly saveFailed = signal(false);

  /** En file et dans l'ordre : la dernière composition reste celle du serveur, même si on ferme la popup. */
  private readonly councilSaves = new Subject<number[]>();

  constructor() {
    this.councilSaves
      .pipe(
        concatMap((sageIds) =>
          this.accountApi.saveCouncil(sageIds).pipe(
            tap(() => this.saveFailed.set(false)),
            catchError(() => {
              this.saveFailed.set(true);
              return EMPTY;
            }),
          ),
        ),
      )
      .subscribe();
  }

  readonly mySages = computed(() => this.sages().filter((sage) => sage.origin === 'mine'));
  readonly council = computed(() => {
    const byId = new Map(this.sages().map((sage) => [sage.id, sage]));
    return this.councilIds()
      .map((id) => byId.get(id))
      .filter((sage): sage is Sage => !!sage);
  });

  /** Rechargé à chaque arrivée sur une page : le compte connecté a pu changer. */
  load(): void {
    this.state.set('loading');
    forkJoin({
      sages: this.sagesApi.list(),
      council: this.accountApi.council(),
      models: this.accountApi.models(),
    }).subscribe({
      next: ({ sages, council, models }) => {
        this.sages.set(sages);
        this.councilIds.set(council.sageIds);
        this.minSages.set(council.min);
        this.maxSages.set(council.max);
        this.models.set(models);
        this.state.set('ready');
      },
      error: () => this.state.set('error'),
    });
  }

  /** Le conseil change tout de suite à l'écran et s'enregistre en arrière-plan. */
  saveCouncil(sageIds: number[]): void {
    this.councilIds.set(sageIds);
    this.councilSaves.next(sageIds);
  }

  createSage(draft: SageDraft): Observable<Sage> {
    return this.sagesApi.create(draft).pipe(tap((sage) => this.sages.update((list) => [...list, sage])));
  }

  updateSage(id: number, draft: SageDraft): Observable<Sage> {
    return this.sagesApi
      .update(id, draft)
      .pipe(tap((sage) => this.sages.update((list) => list.map((other) => (other.id === id ? sage : other)))));
  }

  deleteSage(id: number): Observable<void> {
    return this.sagesApi.delete(id).pipe(
      tap(() => {
        this.sages.update((list) => list.filter((sage) => sage.id !== id));
        this.councilIds.update((ids) => ids.filter((other) => other !== id));
      }),
    );
  }
}
