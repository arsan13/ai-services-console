import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  UserAccessRequestResponse,
  CreateAccessRequestPayload,
  PendingRolesPermissions
} from '../models/access-request.model';
import { Page } from '../models/page.model';
import { AccessRequestStatus } from '../enums/access-request-status.enum';

@Injectable({ providedIn: 'root' })
export class UserAccessRequestService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/me/access-requests`;

  createAccessRequest(payload: CreateAccessRequestPayload): Observable<UserAccessRequestResponse> {
    return this.http.post<UserAccessRequestResponse>(this.apiUrl, payload);
  }

  getAccessRequestsByStatus(
    status: AccessRequestStatus,
    page: number = 0,
    size: number = 10
  ): Observable<Page<UserAccessRequestResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<UserAccessRequestResponse>>(`${this.apiUrl}/status/${status}`, { params });
  }

  getAllAccessRequests(page: number = 0, size: number = 10): Observable<Page<UserAccessRequestResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<UserAccessRequestResponse>>(this.apiUrl, { params });
  }

  getAccessRequestById(requestId: number): Observable<UserAccessRequestResponse> {
    return this.http.get<UserAccessRequestResponse>(`${this.apiUrl}/${requestId}`);
  }

  getPendingRolesPermissions(): Observable<PendingRolesPermissions> {
    return this.http.get<PendingRolesPermissions>(`${this.apiUrl}/pending/roles-permissions`);
  }

  cancelAccessRequest(requestId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${requestId}/cancel`, {});
  }
}