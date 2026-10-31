import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DebateEvent } from '@/models/debate.model';
import { AuthService } from './auth.service';
import { SseParser } from './sse-parser';

/**
 * Suit le flux d'un débat. EventSource ne sait pas envoyer d'en-tête Authorization : on passe par fetch,
 * et donc on gère ici le renouvellement du jeton que l'intercepteur assure pour HttpClient.
 */
@Injectable({ providedIn: 'root' })
export class DebateStreamService {
  private readonly auth = inject(AuthService);

  /** Se termine quand le serveur ferme le flux ; rejette si la connexion échoue. */
  async follow(debateId: number, signal: AbortSignal, onEvent: (event: DebateEvent) => void): Promise<void> {
    let response = await this.open(debateId, signal);
    if (response.status === 401 && this.auth.hasRefreshToken()) {
      await firstValueFrom(this.auth.refreshTokens());
      response = await this.open(debateId, signal);
    }
    if (!response.ok || !response.body) {
      throw new Error(`Flux indisponible (${response.status})`);
    }

    const parser = new SseParser();
    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
    for (;;) {
      const { value, done } = await reader.read();
      if (done) return;
      parser.push(value).forEach(onEvent);
    }
  }

  private open(debateId: number, signal: AbortSignal): Promise<Response> {
    return fetch(`/api/debates/${debateId}/events`, {
      headers: { Accept: 'text/event-stream', Authorization: `Bearer ${this.auth.getAccessToken()}` },
      signal,
    });
  }
}
