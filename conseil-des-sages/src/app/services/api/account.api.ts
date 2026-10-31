import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CouncilView, LlmModel, Profile, Stats } from '@/models/account.model';

@Injectable({ providedIn: 'root' })
export class AccountApi {
  private readonly http = inject(HttpClient);

  profile(): Observable<Profile> {
    return this.http.get<Profile>('/api/me');
  }

  rename(name: string): Observable<Profile> {
    return this.http.patch<Profile>('/api/me', { name });
  }

  council(): Observable<CouncilView> {
    return this.http.get<CouncilView>('/api/me/council');
  }

  saveCouncil(sageIds: number[]): Observable<CouncilView> {
    return this.http.put<CouncilView>('/api/me/council', { sageIds });
  }

  models(): Observable<LlmModel[]> {
    return this.http.get<LlmModel[]>('/api/llm/models');
  }

  stats(): Observable<Stats> {
    return this.http.get<Stats>('/api/stats');
  }
}
