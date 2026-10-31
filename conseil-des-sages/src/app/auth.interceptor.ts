import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { HttpContextToken } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './services/auth.service';

const RETRIED_AFTER_REFRESH = new HttpContextToken<boolean>(() => false);

function isAuthEndpoint(url: string): boolean {
  return url.includes('/api/auth/');
}

function withAccessToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const backendRequest =
    request.url.startsWith('/api/') ||
    ['/user', '/sage', '/sessions', '/roles'].some(
      (prefix) => request.url === prefix || request.url.startsWith(`${prefix}/`),
    );
  if (!backendRequest || isAuthEndpoint(request.url)) return next(request);

  const token = auth.getAccessToken();
  const authorizedRequest = token ? withAccessToken(request, token) : request;

  return next(authorizedRequest).pipe(
    catchError((error: unknown) => {
      if (
        !(error instanceof HttpErrorResponse) ||
        error.status !== 401 ||
        request.context.get(RETRIED_AFTER_REFRESH) ||
        !auth.hasRefreshToken()
      ) {
        return throwError(() => error);
      }

      return auth.refreshTokens().pipe(
        catchError((refreshError: unknown) => {
          auth.clearSession();
          return throwError(() => refreshError);
        }),
        switchMap((tokens) =>
          next(
            withAccessToken(
              request.clone({ context: request.context.set(RETRIED_AFTER_REFRESH, true) }),
              tokens.accessToken,
            ),
          ),
        ),
      );
    }),
  );
};
