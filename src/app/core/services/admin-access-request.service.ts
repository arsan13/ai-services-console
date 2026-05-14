import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AdminAccessRequestSummary,
  ReviewAccessRequestPayload,
  RevokeAccessRequestPayload
} from '../models/access-request.model';
import { Page } from '../models/page.model';
import { AccessRequestStatus } from '../enums/access-request-status.enum';

@Injectable({ providedIn: 'root' })
export class AdminAccessRequestService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/admin/access-requests`;

  getAllAccessRequests(page: number = 0, size: number = 10): Observable<Page<AdminAccessRequestSummary>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<AdminAccessRequestSummary>>(this.apiUrl, { params });
  }

  getAccessRequestsByStatus(
    status: AccessRequestStatus,
    page: number = 0,
    size: number = 10
  ): Observable<Page<AdminAccessRequestSummary>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<AdminAccessRequestSummary>>(`${this.apiUrl}/status/${status}`, { params });
  }

  getAccessRequestById(requestId: number): Observable<AdminAccessRequestSummary> {
    return this.http.get<AdminAccessRequestSummary>(`${this.apiUrl}/${requestId}`);
  }

  reviewAccessRequest(payload: ReviewAccessRequestPayload): Observable<AdminAccessRequestSummary> {
    return this.http.put<AdminAccessRequestSummary>(`${this.apiUrl}/review`, payload);
  }

  revokeAccessRequest(payload: RevokeAccessRequestPayload): Observable<AdminAccessRequestSummary> {
    return this.http.put<AdminAccessRequestSummary>(`${this.apiUrl}/revoke`, payload);
  }
}