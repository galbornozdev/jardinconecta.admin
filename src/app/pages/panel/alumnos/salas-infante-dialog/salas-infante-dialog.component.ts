import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { InfantesService, Infante } from '../../../../core/services/infantes.service';
import { Sala } from '../../../../core/services/salas.service';

@Component({
  selector: 'app-salas-infante-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './salas-infante-dialog.component.html',
  styleUrl: './salas-infante-dialog.component.scss'
})
export class SalasInfanteDialogComponent {
  private infantesService = inject(InfantesService);

  salasAsignadas: Sala[];
  salasDisponibles: Sala[];
  loadingId: string | null = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { infante: Infante; salas: Sala[] }) {
    const idsAsignados = new Set((data.infante.salas ?? []).map(s => s.idSala));
    this.salasAsignadas = data.salas.filter(s => idsAsignados.has(s.id));
    this.salasDisponibles = data.salas.filter(s => !idsAsignados.has(s.id));
  }

  asignar(sala: Sala): void {
    this.loadingId = sala.id;
    this.infantesService.asignarSala(this.data.infante.id, sala.id).subscribe({
      next: () => {
        this.salasDisponibles = this.salasDisponibles.filter(s => s.id !== sala.id);
        this.salasAsignadas = [...this.salasAsignadas, sala];
        this.loadingId = null;
      },
      error: () => { this.loadingId = null; }
    });
  }

  desasignar(sala: Sala): void {
    this.loadingId = sala.id;
    this.infantesService.desasignarSala(this.data.infante.id, sala.id).subscribe({
      next: () => {
        this.salasAsignadas = this.salasAsignadas.filter(s => s.id !== sala.id);
        this.salasDisponibles = [...this.salasDisponibles, sala];
        this.loadingId = null;
      },
      error: () => { this.loadingId = null; }
    });
  }
}
