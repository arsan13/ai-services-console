import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { finalize } from 'rxjs';
import { AdminAccessRequestService } from '../../../core/services/admin-access-request.service';
import { ConfirmationDialogService } from '../../../core/services/confirmation-dialog.service';
import { UserService } from '../../../core/services/user.service';
import { PERMISSIONS } from '../../../core/models/permission.model';
import { ACCESS_REQUEST_PAGE_SIZE, ACCESS_REQUEST_STATUS_OPTIONS } from '../access-request-constants';
import { AdminAccessRequestSummary } from '../../../core/models/access-request.model';
import { AccessRequestStatus } from '../../../core/enums/access-request-status.enum';

type AdminFilterStatus = AccessRequestStatus | 'ALL';

@Component({
  selector: 'app-admin-approvals',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  templateUrl: './admin-approvals.component.html',
  styleUrl: './admin-approvals.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminApprovalsComponent implements OnInit {
  private static readonly ACTION_TRANSITION_DELAY_MS = 450;

  private readonly accessRequestService = inject(AdminAccessRequestService);
  private readonly confirmationDialog = inject(ConfirmationDialogService);
  private readonly userService = inject(UserService);
  private readonly snackBar = inject(MatSnackBar);

  readonly statusEnum = AccessRequestStatus;
  readonly isLoading = signal(false);
  readonly requests = signal<AdminAccessRequestSummary[]>([]);
  readonly currentPage = signal(0);
  readonly pageSize = signal(ACCESS_REQUEST_PAGE_SIZE);
  readonly totalPages = signal(0);
  readonly processingIds = signal<Set<number>>(new Set());
  readonly transitioningIds = signal<Set<number>>(new Set());
  readonly reviewerComments = signal<Record<number, string>>({});
  readonly selectedStatus = signal<AdminFilterStatus>('ALL');
  readonly statusOptions: ReadonlyArray<AdminFilterStatus> = ACCESS_REQUEST_STATUS_OPTIONS;

  ngOnInit(): void {
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
          this.transitioningIds.set(new Set());
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

  private normalizeFilterStatus(rawStatus: string): AdminFilterStatus {
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

  isProcessing(requestId: number): boolean {
    return this.processingIds().has(requestId);
  }

  isTransitioning(requestId: number): boolean {
    return this.transitioningIds().has(requestId);
  }

  getReviewerComment(requestId: number): string {
    return this.reviewerComments()[requestId] ?? '';
  }

  updateReviewerComment(requestId: number, comment: string): void {
    this.reviewerComments.update((current) => ({
      ...current,
      [requestId]: comment
    }));
  }

  hasReviewerComment(requestId: number): boolean {
    return this.getReviewerComment(requestId).trim().length > 0;
  }

  canApproveRequests(): boolean {
    return this.userService.hasPermission(PERMISSIONS.REQUEST_ACCESS_APPROVE);
  }

  onApprove(requestId: number): void {
    const comment = this.getReviewerComment(requestId);

    this.setProcessing(requestId, true);
    this.accessRequestService.reviewAccessRequest({
      requestId,
      status: AccessRequestStatus.APPROVED,
      reviewerComment: comment
    })
      .pipe(
        finalize(() => this.setProcessing(requestId, false))
      )
      .subscribe({
        next: () => {
          this.handleSuccessfulActionTransition(requestId, 'Access request approved successfully');
        },
        error: (err) => {
          this.snackBar.open('Failed to approve request', 'Close', { duration: 5000 });
          console.error('Error approving request:', err);
        }
      });
  }

  onReject(requestId: number): void {
    const comment = this.getReviewerComment(requestId);

    this.confirmationDialog.confirm({
      title: 'Reject Request',
      message: 'Are you sure you want to reject this access request? This action cannot be undone.',
      actionLabel: 'Reject',
      cancelLabel: 'Cancel',
      isDestructive: true
    }).subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      this.setProcessing(requestId, true);
      this.accessRequestService.reviewAccessRequest({
        requestId,
        status: AccessRequestStatus.REJECTED,
        reviewerComment: comment
      })
        .pipe(
          finalize(() => this.setProcessing(requestId, false))
        )
        .subscribe({
          next: () => {
            this.handleSuccessfulActionTransition(requestId, 'Access request rejected successfully');
          },
          error: (err) => {
            this.snackBar.open('Failed to reject request', 'Close', { duration: 5000 });
            console.error('Error rejecting request:', err);
          }
        });
    });
  }

  onRevoke(requestId: number): void {
    const comment = this.getReviewerComment(requestId);

    this.confirmationDialog.confirm({
      title: 'Revoke Access',
      message: 'Are you sure you want to revoke this access? The user will lose all associated permissions immediately.',
      actionLabel: 'Revoke',
      cancelLabel: 'Cancel',
      isDestructive: true
    }).subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      this.setProcessing(requestId, true);
      this.accessRequestService.revokeAccessRequest({ requestId, reviewerComment: comment })
        .pipe(
          finalize(() => this.setProcessing(requestId, false))
        )
        .subscribe({
          next: () => {
            this.handleSuccessfulActionTransition(requestId, 'Access revoked successfully');
          },
          error: (err) => {
            this.snackBar.open('Failed to revoke access', 'Close', { duration: 5000 });
            console.error('Error revoking access:', err);
          }
        });
    });
  }

  onPreviousPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.set(this.currentPage() - 1);
      this.loadRequests();
    }
  }

  onNextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.set(this.currentPage() + 1);
      this.loadRequests();
    }
  }

  private setProcessing(requestId: number, isProcessing: boolean): void {
    const newSet = new Set(this.processingIds());
    if (isProcessing) {
      newSet.add(requestId);
    } else {
      newSet.delete(requestId);
    }
    this.processingIds.set(newSet);
  }

  private clearReviewerComment(requestId: number): void {
    this.reviewerComments.update((current) => {
      const next = { ...current };
      delete next[requestId];
      return next;
    });
  }

  private setTransitioning(requestId: number, isTransitioning: boolean): void {
    const next = new Set(this.transitioningIds());
    if (isTransitioning) {
      next.add(requestId);
    } else {
      next.delete(requestId);
    }
    this.transitioningIds.set(next);
  }

  private handleSuccessfulActionTransition(requestId: number, message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
    this.clearReviewerComment(requestId);
    this.setTransitioning(requestId, true);

    setTimeout(() => {
      this.loadRequests();
    }, AdminApprovalsComponent.ACTION_TRANSITION_DELAY_MS);
  }
}
