import { catchError, map, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ChangePasswordPayload, UserProfile } from '../models/auth.model';
import { Permission } from '../models/permission.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly meUrl = `${environment.apiUrl}/me`;

  private readonly currentUserSignal = signal<UserProfile | null>(null);
  readonly currentUser = this.currentUserSignal.asReadonly();

  verifySession(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.meUrl).pipe(
      tap(user => this.currentUserSignal.set(user))
    );
  }

  changePassword(payload: ChangePasswordPayload): Observable<void> {
    return this.http.post<unknown>(`${this.meUrl}/change-password`, payload).pipe(
      map(() => void 0)
    );
  }

  load(): Observable<UserProfile | null> {
    return this.verifySession().pipe(
      catchError(() => {
        this.currentUserSignal.set(null);
        return of(null);
      })
    );
  }

  set(user: UserProfile | null): void {
    this.currentUserSignal.set(user);
  }

  hasPermission(permission: Permission): boolean {
    const permissions = this.currentUserSignal()?.permissions ?? [];
    return permissions.some((userPermission) => this.matchPermission(userPermission, permission));
  }

  private matchPermission(userPermission: string, requiredPermission: string): boolean {
    return this.canonicalPermission(userPermission) === this.canonicalPermission(requiredPermission);
  }

  private canonicalPermission(permission: string): string {
    return permission.replace('request_access', 'request:access').trim().toLowerCase();
  }

  clear(): void {
    this.currentUserSignal.set(null);
  }
}
