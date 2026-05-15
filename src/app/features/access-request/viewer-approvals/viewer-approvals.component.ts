import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { finalize } from 'rxjs';
import { AdminAccessRequestService } from '../../../core/services/admin-access-request.service';
import { AdminAccessRequestSummary } from '../../../core/models/access-request.model';
import { AccessRequestStatus } from '../../../core/enums/access-request-status.enum';
import { ACCESS_REQUEST_PAGE_SIZE, ACCESS_REQUEST_STATUS_OPTIONS } from '../access-request-constants';

type ViewerFilterStatus = AccessRequestStatus | 'ALL';

@Component({
  selector: 'app-viewer-approvals',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  templateUrl: './viewer-approvals.component.html',
  styleUrl: './viewer-approvals.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewerApprovalsComponent implements OnInit {
  private readonly accessRequestService = inject(AdminAccessRequestService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly platformId = inject(PLATFORM_ID);

  readonly statusEnum = AccessRequestStatus;
  readonly isLoading = signal(false);
  readonly requests = signal<AdminAccessRequestSummary[]>([]);
  readonly currentPage = signal(0);
  readonly pageSize = signal(ACCESS_REQUEST_PAGE_SIZE);
  readonly totalPages = signal(0);
  readonly selectedStatus = signal<ViewerFilterStatus>('ALL');
  readonly statusOptions: ReadonlyArray<ViewerFilterStatus> = ACCESS_REQUEST_STATUS_OPTIONS;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.loadRequests();
  }

  private loadRequests(showRefreshToast: boolean = false): void {
    this.isLoading.set(true);
    const status = this.selectedStatus();
    const requests$ = status === 'ALL'
      ? this.accessRequestService.getAllAccessRequests(this.currentPage(), this.pageSize())
      : this.accessRequestService.getAccessRequestsByStatus(status, this.currentPage(), this.pageSize());

    requests$
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (page) => {
          this.requests.set(page.content);
          this.totalPages.set(page.totalPages);
          if (showRefreshToast) {
            this.snackBar.open('Table refreshed', 'Close', { duration: 2000 });
          }
        },
        error: (err) => {
          if (!this.isExpectedAccessRestriction(err)) {
            this.snackBar.open('Failed to load access requests', 'Close', { duration: 5000 });
          }
          console.error('Error loading access requests:', err);
        }
      });
  }

  private isExpectedAccessRestriction(err: unknown): boolean {
    return err instanceof HttpErrorResponse && (err.status === 401 || err.status === 403);
  }

  onStatusChange(status: string): void {
    const normalized = this.normalizeFilterStatus(status);
    this.selectedStatus.set(normalized);
    this.currentPage.set(0);
    this.loadRequests();
  }

  onRefresh(): void {
    this.loadRequests(true);
  }

  private normalizeFilterStatus(rawStatus: string): ViewerFilterStatus {
    const normalized = rawStatus.trim().toUpperCase();

    if (normalized === 'ALL') {
      return 'ALL';
    }

    if (normalized === 'CANCELLED') {
      return AccessRequestStatus.CANCELLED;
    }

    const statuses = Object.values(AccessRequestStatus);
    return statuses.includes(normalized as AccessRequestStatus)
      ? (normalized as AccessRequestStatus)
      : 'ALL';
  }

  onPreviousPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update(p => p - 1);
      this.loadRequests();
    }
  }

  onNextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.update(p => p + 1);
      this.loadRequests();
    }
  }
}
