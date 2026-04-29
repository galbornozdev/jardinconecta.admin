import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ComunicadoItem {
  id: string;
  titulo: string;
  contenido: string;
  autor: string;
  views: number;
  fechaCreacion: string;
  estado: number;
  fechaPublicacion: string | null;
  fechaPrograma: string | null;
}

export interface PagedResult<T> {
  items: T[];
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface ComunicadosFilter {
  page: number;
  pageSize: number;
  idSala?: string;
  estado?: number;
  fechaDesde?: string;
  fechaHasta?: string;
}

@Injectable({ providedIn: 'root' })
export class ComunicadosService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/Comunicados`;

  getAll(filter: ComunicadosFilter): Observable<PagedResult<ComunicadoItem>> {
    const params: Record<string, string> = {
      page: filter.page.toString(),
      pageSize: filter.pageSize.toString(),
    };
    if (filter.idSala) params['idSala'] = filter.idSala;
    if (filter.estado != null) params['estado'] = filter.estado.toString();
    if (filter.fechaDesde) params['fechaDesde'] = filter.fechaDesde;
    if (filter.fechaHasta) params['fechaHasta'] = filter.fechaHasta;
    return this.http.get<PagedResult<ComunicadoItem>>(this.base, { params });
  }
}
