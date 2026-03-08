import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AdminService } from '../../../../core/services/admin.service';
import { Infante } from '../../../../core/services/infantes.service';
import { Sala } from '../../../../core/services/salas.service';

@Component({
  selector: 'app-codigo-invitacion-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './codigo-invitacion-dialog.component.html',
  styleUrl: './codigo-invitacion-dialog.component.scss'
})
export class CodigoInvitacionDialogComponent {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);

  form = this.fb.group({
    salaId: [null as string | null, Validators.required],
    fechaExpiracion: ['', Validators.required]
  });

  loading = false;
  codigoGenerado = '';
  copiado = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { infante: Infante; salas: Sala[] }) {}

  generar(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const { salaId, fechaExpiracion } = this.form.value;

    this.adminService.generarInvitacion({
      idInfante: this.data.infante.id,
      idSala: salaId!,
      fechaExpiracion: new Date(fechaExpiracion!).toISOString()
    }).subscribe({
      next: (inv) => {
        this.codigoGenerado = inv.codigo;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  copiar(): void {
    navigator.clipboard.writeText(this.codigoGenerado).then(() => {
      this.copiado = true;
      setTimeout(() => this.copiado = false, 2000);
    });
  }
}
