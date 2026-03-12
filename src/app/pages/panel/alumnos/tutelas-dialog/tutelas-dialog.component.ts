import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InfantesService, Infante, InfanteDetalleTutela } from '../../../../core/services/infantes.service';

@Component({
  selector: 'app-tutelas-dialog',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatListModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule, MatTooltipModule
  ],
  templateUrl: './tutelas-dialog.component.html',
  styleUrl: './tutelas-dialog.component.scss'
})
export class TutelasDialogComponent implements OnInit {
  private infantesService = inject(InfantesService);
  tutelas: InfanteDetalleTutela[] = [];
  loading = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { infante: Infante }) {}

  ngOnInit(): void {
    this.infantesService.getById(this.data.infante.id).subscribe({
      next: (detalle) => { this.tutelas = detalle.tutelas; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  eliminar(tutela: InfanteDetalleTutela): void {
    if (!confirm(`¿Eliminar la tutela de ${tutela.nombreUsuario} ${tutela.apellidoUsuario}?`)) return;
    this.infantesService.deleteTutela(this.data.infante.id, tutela.idUsuario).subscribe({
      next: () => { this.tutelas = this.tutelas.filter(t => t.idUsuario !== tutela.idUsuario); }
    });
  }
}
