import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Sage, SageDraft } from '@/models/sage.model';

const URL = '/api/sages';

@Injectable({ providedIn: 'root' })
export class SagesApi {
  private readonly http = inject(HttpClient);

  list(): Observable<Sage[]> {
    return this.http.get<Sage[]>(URL);
  }

  create(draft: SageDraft): Observable<Sage> {
    return this.http.post<Sage>(URL, draft);
  }

  update(id: number, draft: SageDraft): Observable<Sage> {
    return this.http.put<Sage>(`${URL}/${id}`, draft);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${URL}/${id}`);
  }
}
