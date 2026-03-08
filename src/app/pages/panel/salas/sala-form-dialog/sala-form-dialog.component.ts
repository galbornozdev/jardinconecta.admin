import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SalasService } from '../../../../core/services/salas.service';

@Component({
  selector: 'app-sala-form-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule
  ],
  templateUrl: './sala-form-dialog.component.html',
  styleUrl: './sala-form-dialog.component.scss'
})
export class SalaFormDialogComponent {
  private fb = inject(FormBuilder);
  private salasService = inject(SalasService);
  dialogRef = inject(MatDialogRef<SalaFormDialogComponent>);

  form = this.fb.group({ nombre: ['', Validators.required] });
  loading = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: unknown) {}

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.salasService.create({ nombre: this.form.value.nombre! }).subscribe({
      next: (sala) => this.dialogRef.close(sala),
      error: () => { this.loading = false; }
    });
  }
}
