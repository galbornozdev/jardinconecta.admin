import { Component, ElementRef, inject, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AdminService } from '../../../../core/services/admin.service';
import { InfantesService, Infante } from '../../../../core/services/infantes.service';
import { Sala } from '../../../../core/services/salas.service';

const infantesRequeridoValidator: ValidatorFn = (control: AbstractControl) => {
  const val: string[] = control.value ?? [];
  return val.length > 0 ? null : { required: true };
};

@Component({
  selector: 'app-codigo-invitacion-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatChipsModule,
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
  @ViewChild('infanteInput') infanteInput!: ElementRef<HTMLInputElement>;

  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  private infantesService = inject(InfantesService);

  form = this.fb.group({
    tipoInvitacion: [1, Validators.required],
    infanteIds: new FormControl<string[]>([], { validators: infantesRequeridoValidator, nonNullable: true }),
    fechaExpiracion: ['', Validators.required]
  });

  infanteBusqueda = new FormControl('');
  infantes: Infante[] = [];
  infantesFiltrados: Infante[] = [];
  infantesSeleccionados: Infante[] = [];
  loading = false;
  loadingInfantes = true;
  codigoGenerado = '';
  copiado = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { sala: Sala }) {}

  ngOnInit(): void {
    this.infantesService.getAll(undefined, this.data.sala.id).subscribe({
      next: (infantes) => {
        this.infantes = infantes.sort((a, b) => {
          const cmpApellido = a.apellido.localeCompare(b.apellido, 'es');
          return cmpApellido !== 0 ? cmpApellido : a.nombre.localeCompare(b.nombre, 'es');
        });
        this.infantesFiltrados = [...this.infantes];
        this.loadingInfantes = false;
      },
      error: () => { this.loadingInfantes = false; }
    });

    this.infanteBusqueda.valueChanges.subscribe(valor => {
      this.infantesFiltrados = this.filtrarInfantes(valor ?? '');
    });

    this.form.get('tipoInvitacion')!.valueChanges.subscribe(tipo => {
      const infanteControl = this.form.get('infanteIds')!;
      if (tipo !== 1) {
        infanteControl.clearValidators();
        infanteControl.setValue([]);
        this.infantesSeleccionados = [];
        this.infanteBusqueda.setValue('');
        this.infantesFiltrados = [...this.infantes];
      } else {
        infanteControl.setValidators(infantesRequeridoValidator);
      }
      infanteControl.updateValueAndValidity();
    });
  }

  private filtrarInfantes(termino: string): Infante[] {
    const t = termino.toLowerCase().trim();
    return this.infantes.filter(i =>
      !this.infantesSeleccionados.some(s => s.id === i.id) &&
      (`${i.apellido} ${i.nombre}`.toLowerCase().includes(t) ||
       `${i.nombre} ${i.apellido}`.toLowerCase().includes(t))
    );
  }

  seleccionarInfante(event: MatAutocompleteSelectedEvent): void {
    const infante: Infante = event.option.value;
    if (!this.infantesSeleccionados.some(s => s.id === infante.id)) {
      this.infantesSeleccionados = [...this.infantesSeleccionados, infante];
      this.form.get('infanteIds')!.setValue(this.infantesSeleccionados.map(i => i.id));
    }
    this.infanteBusqueda.setValue('');
    this.infanteInput.nativeElement.value = '';
    this.infantesFiltrados = this.filtrarInfantes('');
  }

  removerInfante(infante: Infante): void {
    this.infantesSeleccionados = this.infantesSeleccionados.filter(s => s.id !== infante.id);
    this.form.get('infanteIds')!.setValue(this.infantesSeleccionados.map(i => i.id));
    this.infantesFiltrados = this.filtrarInfantes(this.infanteBusqueda.value ?? '');
  }

  get esFamilia(): boolean {
    return this.form.get('tipoInvitacion')!.value === 1;
  }

  generar(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const { infanteIds, fechaExpiracion, tipoInvitacion } = this.form.value;

    this.adminService.generarInvitacion({
      idsInfante: infanteIds && infanteIds.length > 0 ? infanteIds : undefined,
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
