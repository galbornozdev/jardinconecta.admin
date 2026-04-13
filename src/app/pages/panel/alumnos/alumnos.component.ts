import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InfantesService, Infante } from '../../../core/services/infantes.service';
import { SalasService, Sala } from '../../../core/services/salas.service';
import { AuthService } from '../../../core/services/auth.service';
import { AlumnoFormDialogComponent } from './alumno-form-dialog/alumno-form-dialog.component';
import { ImportarAlumnosDialogComponent } from './importar-alumnos-dialog/importar-alumnos-dialog.component';
import { TutelasDialogComponent } from './tutelas-dialog/tutelas-dialog.component';

@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './alumnos.component.html',
  styleUrl: './alumnos.component.scss'
})
export class AlumnosComponent implements OnInit {
  private infantesService = inject(InfantesService);
  private salasService = inject(SalasService);
  private auth = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  infantes: Infante[] = [];
  salas: Sala[] = [];
  loading = true;
  columns = ['nombre', 'apellido', 'documento', 'acciones'];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    const idJardin = this.auth.getIdJardin() ?? undefined;
    this.salasService.getAll(idJardin).subscribe(salas => {
      this.salas = salas;
      this.infantesService.getAll(idJardin).subscribe({
        next: (infantes) => { this.infantes = infantes; this.loading = false; },
        error: () => { this.loading = false; }
      });
    });
  }

  openImportar(): void {
    const ref = this.dialog.open(ImportarAlumnosDialogComponent, { disableClose: true });
    ref.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
        this.snackBar.open('Importación completada', 'OK', { duration: 3000 });
      }
    });
  }

  openCreate(): void {
    const ref = this.dialog.open(AlumnoFormDialogComponent, {
      data: { salas: this.salas }
    });
    ref.afterClosed().subscribe(result => {
      if (result) { this.loadData(); this.snackBar.open('Alumno creado', 'OK', { duration: 3000 }); }
    });
  }

  openEdit(infante: Infante): void {
    const ref = this.dialog.open(AlumnoFormDialogComponent, {
      data: { infante, salas: this.salas }
    });
    ref.afterClosed().subscribe(result => {
      if (result) { this.loadData(); this.snackBar.open('Alumno actualizado', 'OK', { duration: 3000 }); }
    });
  }

  openTutelas(infante: Infante): void {
    this.dialog.open(TutelasDialogComponent, { data: { infante } });
  }

  confirmDelete(infante: Infante): void {
    if (!confirm(`¿Eliminar a ${infante.nombre} ${infante.apellido}?`)) return;
    this.infantesService.delete(infante.id).subscribe({
      next: () => { this.loadData(); this.snackBar.open('Alumno eliminado', 'OK', { duration: 3000 }); },
      error: () => this.snackBar.open('Error al eliminar', 'OK', { duration: 3000 })
    });
  }
}
