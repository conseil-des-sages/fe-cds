import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DebateDetail, DebateMessage, DebateSummary, NewDebate } from '@/models/debate.model';

const URL = '/api/debates';

@Injectable({ providedIn: 'root' })
export class DebatesApi {
  private readonly http = inject(HttpClient);

  create(debate: NewDebate): Observable<DebateDetail> {
    return this.http.post<DebateDetail>(URL, debate);
  }

  list(): Observable<DebateSummary[]> {
    return this.http.get<DebateSummary[]>(URL);
  }

  get(id: number): Observable<DebateDetail> {
    return this.http.get<DebateDetail>(`${URL}/${id}`);
  }

  interject(id: number, content: string): Observable<DebateMessage> {
    return this.http.post<DebateMessage>(`${URL}/${id}/messages`, { content });
  }

  archive(id: number, archived: boolean): Observable<DebateSummary> {
    return this.http.patch<DebateSummary>(`${URL}/${id}/archive`, { archived });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${URL}/${id}`);
  }
}
