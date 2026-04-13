import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { InfantesService, ImportarResult } from '../../../../core/services/infantes.service';

@Component({
  selector: 'app-importar-alumnos-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './importar-alumnos-dialog.component.html',
  styleUrl: './importar-alumnos-dialog.component.scss'
})
export class ImportarAlumnosDialogComponent {
  private infantesService = inject(InfantesService);
  dialogRef = inject(MatDialogRef<ImportarAlumnosDialogComponent>);

  loading = false;
  archivoSeleccionado: File | null = null;
  resultado: ImportarResult | null = null;
  errorMensaje: string | null = null;

  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.archivoSeleccionado = input.files[0];
      this.resultado = null;
      this.errorMensaje = null;
    }
  }

  descargarPlantilla(): void {
    const contenido = 'nombre;apellido;documento;fechaNacimiento;sala\nJuan;Pérez;12345678;2020-03-15;Sala Azul';
    const bom = '\uFEFF';
    const blob = new Blob([bom + contenido], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'plantilla_alumnos.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  importar(): void {
    if (!this.archivoSeleccionado || this.loading) return;
    this.loading = true;
    this.resultado = null;
    this.errorMensaje = null;

    this.infantesService.importar(this.archivoSeleccionado).subscribe({
      next: (res) => {
        this.resultado = res;
        this.loading = false;
      },
      error: (err) => {
        this.errorMensaje = err?.error?.detail ?? 'Error al importar el archivo.';
        this.loading = false;
      }
    });
  }

  cerrarConExito(): void {
    this.dialogRef.close(true);
  }
}
