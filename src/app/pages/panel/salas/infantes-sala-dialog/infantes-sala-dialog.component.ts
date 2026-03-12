import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { InfantesService, Infante } from '../../../../core/services/infantes.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Sala } from '../../../../core/services/salas.service';

@Component({
  selector: 'app-infantes-sala-dialog',
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
  templateUrl: './infantes-sala-dialog.component.html',
  styleUrl: './infantes-sala-dialog.component.scss'
})
export class InfantesSalaDialogComponent implements OnInit {
  private infantesService = inject(InfantesService);
  private auth = inject(AuthService);

  asignados: Infante[] = [];
  disponibles: Infante[] = [];
  loadingId: string | null = null;
  loading = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { sala: Sala }) {}

  ngOnInit(): void {
    const idJardin = this.auth.getIdJardin() ?? undefined;
    this.infantesService.getAll(idJardin).subscribe({
      next: (infantes) => {
        this.asignados = infantes.filter(i => i.salas?.some(s => s.idSala === this.data.sala.id));
        this.disponibles = infantes.filter(i => !i.salas?.some(s => s.idSala === this.data.sala.id));
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  asignar(infante: Infante): void {
    this.loadingId = infante.id;
    this.infantesService.asignarSala(infante.id, this.data.sala.id).subscribe({
      next: () => {
        this.disponibles = this.disponibles.filter(i => i.id !== infante.id);
        this.asignados = [...this.asignados, infante];
        this.loadingId = null;
      },
      error: () => { this.loadingId = null; }
    });
  }

  desasignar(infante: Infante): void {
    this.loadingId = infante.id;
    this.infantesService.desasignarSala(infante.id, this.data.sala.id).subscribe({
      next: () => {
        this.asignados = this.asignados.filter(i => i.id !== infante.id);
        this.disponibles = [...this.disponibles, infante];
        this.loadingId = null;
      },
      error: () => { this.loadingId = null; }
    });
  }
}
