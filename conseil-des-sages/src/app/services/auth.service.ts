import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, finalize, map, of, shareReplay, tap, throwError } from 'rxjs';

const ACCESS_TOKEN_KEY = 'conseil-des-sages-access-token';
const REFRESH_TOKEN_KEY = 'conseil-des-sages-refresh-token';
const USER_NAME_KEY = 'conseil-des-sages-user-name';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface Registration extends Credentials {
  name: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly accessToken = signal(this.readToken(ACCESS_TOKEN_KEY));
  private readonly refreshToken = signal(this.readToken(REFRESH_TOKEN_KEY));
  private readonly userName = signal(this.readToken(USER_NAME_KEY));
  private refreshRequest: Observable<AuthTokens> | null = null;

  readonly isAuthenticated = computed(() => !!this.accessToken());
  readonly displayName = computed(() => this.userName() || '');

  login(credentials: Credentials): Observable<void> {
    return this.http.post<AuthTokens>('/api/auth/login', credentials).pipe(
      tap((tokens) => this.saveTokens(tokens)),
      map(() => void 0),
    );
  }

  register(registration: Registration): Observable<void> {
    return this.http.post<AuthTokens>('/api/auth/register', registration).pipe(
      tap((tokens) => {
        this.saveTokens(tokens);
        this.saveUserName(registration.name);
      }),
      map(() => void 0),
    );
  }

  refreshTokens(): Observable<AuthTokens> {
    const refreshToken = this.refreshToken();
    if (!refreshToken) return throwError(() => new Error('Aucun refresh token disponible.'));

    if (!this.refreshRequest) {
      this.refreshRequest = this.http
        .post<AuthTokens>('/api/auth/refresh', { refreshToken })
        .pipe(
          tap((tokens) => this.saveTokens(tokens)),
          finalize(() => (this.refreshRequest = null)),
          shareReplay(1),
        );
    }
    return this.refreshRequest;
  }

  logout(): Observable<void> {
    const refreshToken = this.refreshToken();
    if (!refreshToken) {
      this.clearSession();
      return of(void 0);
    }

    return this.http.post<void>('/api/auth/logout', { refreshToken }).pipe(
      catchError(() => of(void 0)),
      finalize(() => this.clearSession()),
    );
  }

  getAccessToken(): string | null {
    return this.accessToken();
  }

  hasRefreshToken(): boolean {
    return !!this.refreshToken();
  }

  clearSession(): void {
    this.accessToken.set(null);
    this.refreshToken.set(null);
    this.removeToken(ACCESS_TOKEN_KEY);
    this.removeToken(REFRESH_TOKEN_KEY);
    this.userName.set(null);
    this.removeToken(USER_NAME_KEY);
  }

  private saveTokens(tokens: AuthTokens): void {
    this.accessToken.set(tokens.accessToken);
    this.refreshToken.set(tokens.refreshToken);
    this.writeToken(ACCESS_TOKEN_KEY, tokens.accessToken);
    this.writeToken(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  private saveUserName(name: string): void {
    this.userName.set(name);
    this.writeToken(USER_NAME_KEY, name);
  }

  private readToken(key: string): string | null {
    try {
      return typeof sessionStorage === 'undefined' ? null : sessionStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private writeToken(key: string, value: string): void {
    try {
      if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(key, value);
    } catch {
      // The current in-memory session still works when browser storage is unavailable.
    }
  }

  private removeToken(key: string): void {
    try {
      if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(key);
    } catch {
      // Nothing else is needed when browser storage is unavailable.
    }
  }
}
