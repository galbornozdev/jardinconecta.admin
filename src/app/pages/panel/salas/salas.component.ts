import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SalasService, Sala } from '../../../core/services/salas.service';
import { AuthService } from '../../../core/services/auth.service';
import { SalaFormDialogComponent } from './sala-form-dialog/sala-form-dialog.component';
import { MiembrosDialogComponent } from './miembros-dialog/miembros-dialog.component';
import { CodigoInvitacionDialogComponent } from '../alumnos/codigo-invitacion-dialog/codigo-invitacion-dialog.component';
import { InfantesSalaDialogComponent } from './infantes-sala-dialog/infantes-sala-dialog.component';
import { AgregarEducadorDialogComponent } from './agregar-educador-dialog/agregar-educador-dialog.component';

@Component({
  selector: 'app-salas',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule, MatButtonModule, MatIconModule,
    MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './salas.component.html',
  styleUrl: './salas.component.scss'
})
export class SalasComponent implements OnInit {
  private salasService = inject(SalasService);
  private auth = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  salas: Sala[] = [];
  loading = true;
  columns = ['nombre', 'acciones'];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    const idJardin = this.auth.getIdJardin() ?? undefined;
    this.salasService.getAll(idJardin).subscribe({
      next: (s) => { this.salas = s; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openCreate(): void {
    const ref = this.dialog.open(SalaFormDialogComponent, { data: {} });
    ref.afterClosed().subscribe(result => {
      if (result) { this.load(); this.snackBar.open('Sala creada', 'OK', { duration: 3000 }); }
    });
  }

  verMiembros(sala: Sala): void {
    this.dialog.open(MiembrosDialogComponent, { data: { sala }, width: '500px' });
  }

  verAlumnos(sala: Sala): void {
    this.dialog.open(InfantesSalaDialogComponent, { data: { sala }, width: '500px' });
  }

  openCodigo(sala: Sala): void {
    this.dialog.open(CodigoInvitacionDialogComponent, { data: { sala } });
  }

  openAgregarEducador(sala: Sala): void {
    const ref = this.dialog.open(AgregarEducadorDialogComponent, { data: { sala }, width: '400px' });
    ref.afterClosed().subscribe(result => {
      if (result) this.snackBar.open('Educador agregado y notificado por email', 'OK', { duration: 3000 });
    });
  }
}
