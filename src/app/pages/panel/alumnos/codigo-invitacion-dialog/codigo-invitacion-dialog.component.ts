import { Component, inject, Inject, OnInit } from '@angular/core';
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
import { InfantesService, Infante } from '../../../../core/services/infantes.service';
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
export class CodigoInvitacionDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  private infantesService = inject(InfantesService);

  form = this.fb.group({
    tipoInvitacion: [1, Validators.required],
    infanteId: [null as string | null, Validators.required],
    fechaExpiracion: ['', Validators.required]
  });

  infantes: Infante[] = [];
  loading = false;
  loadingInfantes = true;
  codigoGenerado = '';
  copiado = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { sala: Sala }) {}

  ngOnInit(): void {
    this.infantesService.getAll(undefined, this.data.sala.id).subscribe({
      next: (infantes) => { this.infantes = infantes; this.loadingInfantes = false; },
      error: () => { this.loadingInfantes = false; }
    });

    this.form.get('tipoInvitacion')!.valueChanges.subscribe(tipo => {
      const infanteControl = this.form.get('infanteId')!;
      if (tipo === 1) {
        infanteControl.setValidators(Validators.required);
      } else {
        infanteControl.clearValidators();
        infanteControl.setValue(null);
      }
      infanteControl.updateValueAndValidity();
    });
  }

  get esFamilia(): boolean {
    return this.form.get('tipoInvitacion')!.value === 1;
  }

  generar(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const { infanteId, fechaExpiracion, tipoInvitacion } = this.form.value;

    this.adminService.generarInvitacion({
      idInfante: infanteId ?? undefined,
      idSala: this.data.sala.id,
      fechaExpiracion: new Date(fechaExpiracion!).toISOString(),
      tipoInvitacion: tipoInvitacion!
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
