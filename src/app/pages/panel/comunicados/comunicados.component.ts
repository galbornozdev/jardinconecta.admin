import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { ComunicadosService, ComunicadoItem } from '../../../core/services/comunicados.service';
import { SalasService, Sala } from '../../../core/services/salas.service';
import { AuthService } from '../../../core/services/auth.service';

const ESTADOS = [
  { value: 1, label: 'Borrador' },
  { value: 2, label: 'Publicado' },
  { value: 3, label: 'Programado' },
];

@Component({
  selector: 'app-comunicados',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatChipsModule,
  ],
  templateUrl: './comunicados.component.html',
  styleUrl: './comunicados.component.scss',
})
export class ComunicadosComponent implements OnInit {
  private comunicadosService = inject(ComunicadosService);
  private salasService = inject(SalasService);
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);

  comunicados: ComunicadoItem[] = [];
  salas: Sala[] = [];
  loading = true;
  totalItems = 0;
  pageSize = 10;
  currentPage = 1;
  readonly estados = ESTADOS;
  readonly columns = ['titulo', 'autor', 'sala', 'estado', 'fechaPublicacion', 'views'];

  filters = this.fb.group({
    idSala: [null as string | null],
    estado: [null as number | null],
    fechaDesde: [null as Date | null],
    fechaHasta: [null as Date | null],
  });

  ngOnInit(): void {
    const idJardin = this.auth.getIdJardin() ?? undefined;
    this.salasService.getAll(idJardin).subscribe(salas => {
      this.salas = salas;
    });
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    const { idSala, estado, fechaDesde, fechaHasta } = this.filters.value;

    this.comunicadosService.getAll({
      page: this.currentPage,
      pageSize: this.pageSize,
      idSala: idSala ?? undefined,
      estado: estado ?? undefined,
      fechaDesde: fechaDesde ? fechaDesde.toISOString() : undefined,
      fechaHasta: fechaHasta ? fechaHasta.toISOString() : undefined,
    }).subscribe({
      next: (result) => {
        this.comunicados = result.items;
        this.totalItems = result.totalPages * this.pageSize;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadData();
  }

  onClear(): void {
    this.filters.reset();
    this.currentPage = 1;
    this.loadData();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  getEstadoLabel(estado: number): string {
    return ESTADOS.find(e => e.value === estado)?.label ?? '—';
  }

  getEstadoColor(estado: number): string {
    if (estado === 2) return 'primary';
    if (estado === 3) return 'accent';
    return '';
  }
}
