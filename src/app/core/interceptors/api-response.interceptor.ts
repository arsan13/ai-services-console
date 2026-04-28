import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map, throwError } from 'rxjs';
import { ApiResponse } from '../models/api.model';

class ApiWrappedError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
  }
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

export const apiResponseInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    map(event => {
      if (event instanceof HttpResponse) {
        const body = event.body;
        if (body && typeof body === 'object' && 'success' in body) {
          const apiResponse = body as ApiResponse<unknown>;
          if (!apiResponse.success) {
            throw new ApiWrappedError(
              apiResponse.message ?? 'Request failed',
              event.status
            );
          }
          return event.clone({ body: apiResponse.data });
        }
      }
      return event;
    }),
    catchError((err: unknown) => {
      let message = 'An unexpected error occurred';
      let status: number | undefined;

      if (err instanceof HttpErrorResponse) {
        status = err.status;
        message = resolveBackendMessage(err.error) ?? err.message;
      } else if (err instanceof ApiWrappedError) {
        status = err.status;
        message = err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      if (isPlatformBrowser(platformId)) {
        showErrorSnackbar(snackBar, message, status);
      }

      return throwError(() => new Error(message));
    })
  );
};
