import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  success(mensaje: string): void {
    this.snackBar.open(mensaje, 'OK', { duration: 3000, panelClass: ['snackbar-success'] });
  }

  error(mensaje: string): void {
    this.snackBar.open(mensaje, 'OK', { duration: 5000, panelClass: ['snackbar-error'] });
  }
}
