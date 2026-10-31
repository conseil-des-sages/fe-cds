import { HttpErrorResponse } from '@angular/common/http';

export const GENERIC_ERROR = 'Une erreur est survenue, on relance ?';

/** Le message à montrer : celui du serveur quand il en donne un, sinon une phrase simple. */
export function apiErrorMessage(error: unknown, fallback = GENERIC_ERROR): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) return 'Le serveur ne répond pas. Vérifie ta connexion, puis réessaie.';
    const body = error.error as { detail?: unknown; errors?: Record<string, string> } | null;
    const firstFieldError = body?.errors ? Object.values(body.errors)[0] : undefined;
    if (firstFieldError) return firstFieldError;
    if (error.status < 500 && typeof body?.detail === 'string' && body.detail.trim()) return body.detail;
  }
  return fallback;
}
