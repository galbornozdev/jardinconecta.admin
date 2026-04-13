import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { catchError, throwError } from 'rxjs';

const EXCLUDED_URLS: string[] = [];

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const excluido = EXCLUDED_URLS.some(url => req.url.includes(url));
      if (!excluido && err.status >= 400 && err.status < 500) {
        const mensaje = err.error?.detail ?? 'Ocurrió un error inesperado.';
        notification.error(mensaje);
      }
      return throwError(() => err);
    })
  );
};
