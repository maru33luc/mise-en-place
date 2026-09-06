import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '@core/services/toast.service';

/**
 * Interpreta los errores del backend (que usan { success, message, errors })
 * y los convierte en un mensaje legible + toast global.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err: unknown) => {
      let message = 'Unexpected error';

      if (err instanceof HttpErrorResponse) {
        const body = err.error as { errors?: { message: string }[]; message?: string };
        if (Array.isArray(body?.errors) && body.errors.length > 0) {
          message = body.errors.map((e) => e.message).join(' · ');
        } else if (body?.message) {
          message = body.message;
        } else if (err.status === 0) {
          message = 'Could not connect to the server';
        }
      }

      if (!req.url.includes('/api/auth/')) {
        toast.error(message);
      }
      return throwError(() => err);
    }),
  );
};