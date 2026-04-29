import { Observable, of, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../models/auth.model';
import { AuthProvider } from '../enums/auth-provider.enum';
import { UserService } from './user.service';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly authApiUrl = `${environment.apiUrl}/auth`;
  private readonly userService = inject(UserService);

  login(data: { username: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authApiUrl}/login`, data).pipe(
      tap(response => this.applySession(response))
    );
  }

  register(data: { fullname: string; username: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authApiUrl}/register`, data).pipe(
      tap(response => this.applySession(response))
    );
  }

  oauth2Login(provider: AuthProvider): void {
    window.location.href = `${this.authApiUrl}/oauth2/${provider}`;
  }

  initializeUser(): Observable<unknown> {
    if (!this.isLoggedIn()) {
      this.userService.clear();
      return of(null);
    }

    // User already set this session (login / register / oauth2 populated it) — skip /me
    if (this.userService.currentUser() !== null) {
      return of(null);
    }

    // Token in localStorage but no in-memory user → app was reloaded, rehydrate via /me
    return this.userService.load();
  }

  completeOauth2Login(token: string): Observable<unknown> {
    this.storeToken(token);
    return this.userService.load();
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }

    this.userService.clear();
  }

  private applySession(response: AuthResponse): void {
    this.storeToken(response.token);
    this.userService.set(response.userProfile ?? null);
  }

  private storeToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
    }
  }

  private getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }

    return null;
  }
}
