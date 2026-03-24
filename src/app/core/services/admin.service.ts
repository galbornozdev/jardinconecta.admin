import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface InvitacionDto {
  idInfante?: string;
  idSala: string;
  fechaExpiracion: string;
  tipoInvitacion: number;
}

export interface Invitacion {
  id: number;
  codigo: string;
  idSala: number;
  fechaExpiracion: string;
  usado: boolean;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/Admin`;

  generarInvitacion(data: InvitacionDto): Observable<Invitacion> {
    return this.http.post<Invitacion>(`${this.base}/Invitaciones`, data);
  }

  listarInvitaciones(idSala: number): Observable<Invitacion[]> {
    return this.http.get<Invitacion[]>(`${this.base}/Invitaciones`, { params: { idSala } });
  }

  // test 2
}
