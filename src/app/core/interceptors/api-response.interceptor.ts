import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map, throwError } from 'rxjs';
import { ApiResponse } from '../models/api.model';
import { AuthService } from '../services/auth.service';

type ResolvedError = {
  message: string;
  status?: number;
};

class ApiWrappedError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
  }
}

const SESSION_VALIDATION_PATHS = ['/me'];

function isApiResponseBody(body: unknown): body is ApiResponse<unknown> {
  return !!body && typeof body === 'object' && 'success' in body;
}

function unwrapApiResponse(event: HttpResponse<unknown>): HttpResponse<unknown> {
  const body = event.body;

  if (!isApiResponseBody(body)) {
    return event;
  }

  if (!body.success) {
    throw new ApiWrappedError(body.message ?? 'Request failed', event.status);
  }

  return event.clone({ body: body.data });
}

function resolveBackendMessage(errorBody: unknown): string | null {
  if (!errorBody || typeof errorBody !== 'object') {
    return null;
  }

  const maybeWrapper = errorBody as { message?: unknown; error?: unknown };
  if (typeof maybeWrapper.message === 'string' && maybeWrapper.message.trim().length > 0) {
    return maybeWrapper.message;
  }

  if (typeof maybeWrapper.error === 'string' && maybeWrapper.error.trim().length > 0) {
    return maybeWrapper.error;
  }

  return null;
}

function showErrorSnackbar(snackBar: MatSnackBar, message: string, status?: number): void {
  const hasHttpErrorCode = typeof status === 'number' && status >= 400;
  const finalMessage = hasHttpErrorCode ? `[${status}] ${message}` : message;

  snackBar.open(finalMessage, 'Dismiss', {
    duration: 5000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: ['app-error-snackbar']
  });
}

function resolveError(err: unknown): ResolvedError {
  if (err instanceof HttpErrorResponse) {
    return {
      status: err.status,
      message: resolveBackendMessage(err.error) ?? err.message
    };
  }

  if (err instanceof ApiWrappedError) {
    return {
      status: err.status,
      message: err.message
    };
  }

  if (err instanceof Error) {
    return { message: err.message };
  }

  return { message: 'An unexpected error occurred' };
}

function shouldLogoutOnUnauthorized(status: number | undefined, requestUrl: string): boolean {
  if (status !== 401) {
    return false;
  }

  return SESSION_VALIDATION_PATHS.some((path) => requestUrl.includes(path));
}

export const apiResponseInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const snackBar = inject(MatSnackBar);
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    map(event => event instanceof HttpResponse ? unwrapApiResponse(event) : event),
    catchError((err: unknown) => {
      const { message, status } = resolveError(err);

      if (shouldLogoutOnUnauthorized(status, req.url)) {
        auth.logout();
        router.navigate(['/login']);
        return throwError(() => new Error(message));
      }

      if (isPlatformBrowser(platformId)) {
        showErrorSnackbar(snackBar, message, status);
      }

      return throwError(() => new Error(message));
    })
  );
};
