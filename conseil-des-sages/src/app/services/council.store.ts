import { Injectable, computed, signal } from '@angular/core';
import { BASE_SAGES, LIBRARY_SAGES, MY_SAGES, QUESTION } from '../data/sages';
import { Sage } from '../data/models';

export const COUNCIL_SIZE = 5;

/** Mock in-memory store for the mockup. Swap for HTTP services in the real app. */
@Injectable({ providedIn: 'root' })
export class CouncilStore {
  readonly mySages = signal<Sage[]>(MY_SAGES);
  readonly councilIds = signal<string[]>(BASE_SAGES.map((s) => s.id));
  readonly question = signal<string>(QUESTION);

  readonly allSages = computed(() => [...BASE_SAGES, ...this.mySages(), ...LIBRARY_SAGES]);

  readonly council = computed(() => {
    const all = this.allSages();
    return this.councilIds()
      .map((id) => all.find((s) => s.id === id))
      .filter((s): s is Sage => !!s);
  });

  sage(id: string): Sage | undefined {
    return this.allSages().find((s) => s.id === id);
  }

  saveSage(sage: Sage): void {
    this.mySages.update((list) => {
      const exists = list.some((s) => s.id === sage.id);
      return exists ? list.map((s) => (s.id === sage.id ? sage : s)) : [sage, ...list];
    });
  }

  deleteSage(id: string): void {
    this.mySages.update((list) => list.filter((s) => s.id !== id));
    this.councilIds.update((ids) => ids.filter((x) => x !== id));
  }
}
