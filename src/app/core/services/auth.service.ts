import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface LoginResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly TOKEN_KEY = 'jc_admin_token';

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, password }).pipe(
      tap(res => localStorage.setItem(this.TOKEN_KEY, res.token))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = this.decodePayload(token);
      return (payload['exp'] as number) * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getUserRole(): number {
    const token = this.getToken();
    if (!token) return 0;
    try {
      const payload = this.decodePayload(token);
      const raw = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
        ?? payload['role']
        ?? 0;
      return Number(raw);
    } catch {
      return 0;
    }
  }

  getIdJardin(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = this.decodePayload(token);
      return (payload['jardinId'] as string) || null;
    } catch {
      return null;
    }
  }

  getUserName(): string {
    const token = this.getToken();
    if (!token) return '';
    try {
      const payload = this.decodePayload(token);
      return (payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] as string)
        || (payload['name'] as string)
        || (payload['email'] as string)
        || '';
    } catch {
      return '';
    }
  }

  private decodePayload(token: string): Record<string, unknown> {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64)) as Record<string, unknown>;
  }
}
