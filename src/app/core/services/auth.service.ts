import { catchError, finalize, Observable, of, shareReplay, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginPayload, RegisterPayload, UserProfile } from '../models/auth.model';
import { AuthProvider } from '../enums/auth-provider.enum';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private static readonly TOKEN_STORAGE_KEY = 'token';

  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly authApiUrl = `${environment.apiUrl}/auth`;
  private readonly userService = inject(UserService);
  private initializeUserRequest$: Observable<UserProfile | null> | null = null;

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authApiUrl}/login`, payload).pipe(
      tap(response => this.applySession(response))
    );
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authApiUrl}/register`, payload).pipe(
      tap(response => this.applySession(response))
    );
  }

  oauth2Login(provider: AuthProvider): void {
    window.location.href = `${this.authApiUrl}/oauth2/${provider}`;
  }

  initializeUser(): Observable<UserProfile | null> {
    if (!this.isLoggedIn()) {
      this.userService.clear();
      return of(null);
    }

    // User already set this session (login / register / oauth2 populated it) — skip /me
    if (this.userService.currentUser() !== null) {
      return of(this.userService.currentUser());
    }

    // Reuse in-flight /me call so app shell and guards do not trigger duplicate checks.
    if (this.initializeUserRequest$) {
      return this.initializeUserRequest$;
    }

    // Token in localStorage but no in-memory user → app was reloaded, rehydrate via /me
    this.initializeUserRequest$ = this.userService.verifySession().pipe(
      catchError(() => {
        this.userService.clear();
        return of(null);
      }),
      finalize(() => {
        this.initializeUserRequest$ = null;
      }),
      shareReplay(1)
    );

    return this.initializeUserRequest$;
  }

  completeOauth2Login(token: string): Observable<UserProfile | null> {
    this.storeToken(token);
    return this.userService.load();
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(AuthService.TOKEN_STORAGE_KEY);
    }

    this.userService.clear();
  }

  private applySession(response: AuthResponse): void {
    this.storeToken(response.token);
    this.userService.set(response.userProfile ?? null);
  }

  private storeToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(AuthService.TOKEN_STORAGE_KEY, token);
    }
  }

  private getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(AuthService.TOKEN_STORAGE_KEY);
    }

    return null;
  }
}
