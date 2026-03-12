import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Infante {
  id: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  documento: string;
  salas?: { idSala: string; nombre: string }[];
}

export interface InfanteDetalleTutela {
  idUsuario: string;
  nombreUsuario: string;
  apellidoUsuario: string;
  tipoTutela: string;
}

export interface InfanteDetalle extends Infante {
  tutelas: InfanteDetalleTutela[];
}

export interface CreateInfanteDto {
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  documento: string;
}

@Injectable({ providedIn: 'root' })
export class InfantesService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/Infantes`;

  getById(infanteId: string): Observable<InfanteDetalle> {
    return this.http.get<InfanteDetalle>(`${this.base}/${infanteId}`);
  }

  getAll(idJardin?: string, idSala?: string): Observable<Infante[]> {
    const params: Record<string, string> = {};
    if (idJardin) params['idJardin'] = idJardin;
    if (idSala) params['idSala'] = idSala;
    return this.http.get<Infante[]>(this.base, { params });
  }

  create(data: CreateInfanteDto): Observable<Infante> {
    return this.http.post<Infante>(this.base, data);
  }

  update(id: string, data: Partial<CreateInfanteDto>): Observable<Infante> {
    return this.http.put<Infante>(`${this.base}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  asignarSala(infanteId: string, salaId: string): Observable<void> {
    return this.http.post<void>(`${this.base}/${infanteId}/Salas/${salaId}`, {});
  }

  desasignarSala(infanteId: string, salaId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${infanteId}/Salas/${salaId}`);
  }

  deleteTutela(infanteId: string, usuarioId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${infanteId}/Tutelas/${usuarioId}`);
  }
}
