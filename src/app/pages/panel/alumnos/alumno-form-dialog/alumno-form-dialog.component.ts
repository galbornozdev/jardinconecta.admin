import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InfantesService, Infante, CreateInfanteDto } from '../../../../core/services/infantes.service';
import { Sala } from '../../../../core/services/salas.service';

@Component({
  selector: 'app-alumno-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './alumno-form-dialog.component.html',
  styleUrl: './alumno-form-dialog.component.scss'
})
export class AlumnoFormDialogComponent {
  private fb = inject(FormBuilder);
  private infantesService = inject(InfantesService);
  dialogRef = inject(MatDialogRef<AlumnoFormDialogComponent>);

  loading = false;

  form = this.fb.group({
    nombre: [this.data.infante?.nombre ?? '', Validators.required],
    apellido: [this.data.infante?.apellido ?? '', Validators.required],
    fechaNacimiento: [this.data.infante?.fechaNacimiento ?? '', Validators.required],
    documento: [this.data.infante?.documento ?? '', Validators.required],
    salaId: [null as string | null]
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: { infante?: Infante; salas: Sala[] }) {}

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const { nombre, apellido, fechaNacimiento, documento, salaId } = this.form.value;

    const dto: CreateInfanteDto = {
      nombre: nombre!,
      apellido: apellido!,
      fechaNacimiento: new Date(fechaNacimiento!).toISOString(),
      documento: documento!
    };

    if (this.data.infante) {
      this.infantesService.update(this.data.infante.id, dto).subscribe({
        next: (infante) => this.dialogRef.close(infante),
        error: () => { this.loading = false; }
      });
    } else {
      this.infantesService.create(dto).subscribe({
        next: (infante) => {
          if (salaId) {
            this.infantesService.asignarSala(infante.id, salaId).subscribe({
              next: () => this.dialogRef.close(infante),
              error: () => this.dialogRef.close(infante)
            });
          } else {
            this.dialogRef.close(infante);
          }
        },
        error: () => { this.loading = false; }
      });
    }
  }
}
