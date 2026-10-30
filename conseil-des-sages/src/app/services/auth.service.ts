import { Injectable, signal } from '@angular/core';

const AUTH_SESSION_KEY = 'conseil-des-sages-authenticated';

/** Frontend-only session placeholder. Replace with a server-backed auth flow for production. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authenticated = signal(
    typeof sessionStorage !== 'undefined' && sessionStorage.getItem(AUTH_SESSION_KEY) === 'true',
  );

  readonly isAuthenticated = this.authenticated.asReadonly();

  signIn(): void {
    this.authenticated.set(true);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
    }
  }

  signOut(): void {
    this.authenticated.set(false);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(AUTH_SESSION_KEY);
    }
  }
}
