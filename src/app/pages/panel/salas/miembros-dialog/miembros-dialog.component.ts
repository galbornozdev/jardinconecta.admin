import { Component, inject, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SalasService, Sala, Miembro, TutelaInfo } from '../../../../core/services/salas.service';

@Component({
  selector: 'app-miembros-dialog',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatListModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatTooltipModule
  ],
  templateUrl: './miembros-dialog.component.html',
  styleUrl: './miembros-dialog.component.scss'
})
export class MiembrosDialogComponent implements OnInit {
  private salasService = inject(SalasService);
  miembros: Miembro[] = [];
  loading = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { sala: Sala }) {}

  ngOnInit(): void {
    this.salasService.getMiembros(this.data.sala.id).subscribe({
      next: (m) => { this.miembros = m; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  remover(miembro: Miembro): void {
    if (!confirm(`¿Remover a ${miembro.nombre} ${miembro.apellido}?`)) return;
    this.salasService.removeMiembro(this.data.sala.id, miembro.idUsuario).subscribe({
      next: () => { this.miembros = this.miembros.filter(m => m.idUsuario !== miembro.idUsuario); }
    });
  }
}
