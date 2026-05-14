import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, shareReplay, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RoleType } from '../enums/role-type.enum';

export type RolePermissionsMap = Partial<Record<RoleType, string[]>>;

@Injectable({ providedIn: 'root' })
export class RolePermissionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/admin/roles/available`;
  private cachedRolePermissions$?: Observable<RolePermissionsMap>;

  getAvailableRolePermissions(forceRefresh: boolean = false): Observable<RolePermissionsMap> {
    if (!this.cachedRolePermissions$ || forceRefresh) {
      this.cachedRolePermissions$ = this.http
        .get<RolePermissionsMap>(this.apiUrl)
        .pipe(
          catchError((error: unknown) => {
            this.cachedRolePermissions$ = undefined;
            return throwError(() => error);
          }),
          shareReplay({ bufferSize: 1, refCount: false })
        );
    }

    return this.cachedRolePermissions$;
  }
}