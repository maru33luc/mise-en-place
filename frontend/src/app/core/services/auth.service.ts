import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { ApiResponse } from '@core/models/api-response.model';
import type { AuthPayload, User } from '@core/models/user.model';

interface AuthData { user: User; token: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly userState = signal<User | null>(this.readUser());
  readonly user = this.userState.asReadonly();
  readonly isAuthenticated = () => Boolean(this.token);
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  get token(): string | null { return localStorage.getItem('mise_token'); }

  login(payload: AuthPayload) {
    return this.http.post<ApiResponse<AuthData>>(`${this.baseUrl}/login`, payload).pipe(tap((response) => { if (response.data) this.persist(response.data); }));
  }

  register(payload: AuthPayload) {
    return this.http.post<ApiResponse<AuthData>>(`${this.baseUrl}/register`, payload).pipe(tap((response) => { if (response.data) this.persist(response.data); }));
  }

  me() {
    return this.http.get<ApiResponse<{ user: User }>>(`${this.baseUrl}/me`).pipe(tap((response) => { if (response.data) this.userState.set(response.data.user); }));
  }

  logout(): void {
    localStorage.removeItem('mise_token');
    localStorage.removeItem('mise_user');
    this.userState.set(null);
    void this.router.navigate(['/auth/login']);
  }

  private persist(data: AuthData): void {
    localStorage.setItem('mise_token', data.token);
    localStorage.setItem('mise_user', JSON.stringify(data.user));
    this.userState.set(data.user);
  }

  private readUser(): User | null {
    try { return JSON.parse(localStorage.getItem('mise_user') ?? 'null') as User | null; } catch { return null; }
  }
}
