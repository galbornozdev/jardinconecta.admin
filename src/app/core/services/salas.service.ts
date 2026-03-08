import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Sala {
  id: string;
  nombre: string;
}

export interface Miembro {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
}

@Injectable({ providedIn: 'root' })
export class SalasService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/Salas`;

  getAll(idJardin?: string): Observable<Sala[]> {
    const params: Record<string, string> = {};
    if (idJardin) params['idJardin'] = idJardin;
    return this.http.get<Sala[]>(this.base, { params });
  }

  create(data: { nombre: string; idJardin?: string }): Observable<Sala> {
    return this.http.post<Sala>(this.base, data);
  }

  getMiembros(salaId: string): Observable<Miembro[]> {
    return this.http.get<Miembro[]>(`${this.base}/${salaId}/Miembros`);
  }

  removeMiembro(salaId: string, usuarioId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${salaId}/Miembros/${usuarioId}`);
  }
}
