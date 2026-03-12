import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SalasService, Sala } from '../../../../core/services/salas.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-agregar-educador-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatProgressSpinnerModule
  ],
  templateUrl: './agregar-educador-dialog.component.html',
  styleUrl: './agregar-educador-dialog.component.scss'
})
export class AgregarEducadorDialogComponent {
  private salasService = inject(SalasService);
  private dialogRef = inject(MatDialogRef<AgregarEducadorDialogComponent>);

  email = '';
  loading = false;
  error: string | null = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { sala: Sala }) {}

  agregar(): void {
    if (!this.email.trim()) return;
    this.loading = true;
    this.error = null;

    this.salasService.agregarEducador(this.data.sala.id, this.email.trim()).subscribe({
      next: () => { this.dialogRef.close(true); },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        if (err.status === 404) this.error = 'No se encontró un usuario con ese email en este jardín.';
        else if (err.status === 409) this.error = 'El usuario ya es miembro de esta sala.';
        else this.error = 'Ocurrió un error. Intentá nuevamente.';
      }
    });
  }
}
