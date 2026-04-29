import { catchError, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserProfile } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly meUrl = `${environment.apiUrl}/me`;

  private readonly currentUserSignal = signal<UserProfile | null>(null);
  readonly currentUser = this.currentUserSignal.asReadonly();

  load(): Observable<UserProfile | null> {
    return this.http.get<UserProfile>(this.meUrl).pipe(
      tap(user => this.currentUserSignal.set(user)),
      catchError(() => {
        this.currentUserSignal.set(null);
        return of(null);
      })
    );
  }

  set(user: UserProfile | null): void {
    this.currentUserSignal.set(user);
  }

  clear(): void {
    this.currentUserSignal.set(null);
  }
}
