import { Component, effect, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { UserAccessRequestService } from '../../../core/services/user-access-request.service';
import { ConfirmationDialogService } from '../../../core/services/confirmation-dialog.service';
import { UserAccessRequestResponse } from '../../../core/models/access-request.model';
import { UserService } from '../../../core/services/user.service';
import { PERMISSIONS } from '../../../core/models/permission.model';
import { ACCESS_REQUEST_PAGE_SIZE } from '../access-request-page-size';

@Component({
  selector: 'app-my-access-requests',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './my-access-requests.component.html',
  styleUrl: './my-access-requests.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyAccessRequestsComponent implements OnInit {
  private readonly accessRequestService = inject(UserAccessRequestService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly confirmationDialog = inject(ConfirmationDialogService);
  private readonly userService = inject(UserService);

  readonly isLoading = signal(false);
  readonly requests = signal<UserAccessRequestResponse[]>([]);
  readonly currentPage = signal(0);
  readonly pageSize = signal(ACCESS_REQUEST_PAGE_SIZE);
  readonly totalPages = signal(0);

  constructor() {
    effect(() => {
      const currentUser = this.userService.currentUser();
      if (!currentUser) {
        return;
      }

      if (this.userService.hasPermission(PERMISSIONS.REQUEST_ACCESS_APPROVE)) {
        this.router.navigate(['/access-requests/admin']);
      }
    });
  }

  ngOnInit(): void {
    if (this.userService.hasPermission(PERMISSIONS.REQUEST_ACCESS_APPROVE)) {
      this.router.navigate(['/access-requests/admin']);
      return;
    }

    this.loadRequests();
  }

  private loadRequests(): void {
    this.isLoading.set(true);
    this.accessRequestService.getAllAccessRequests(this.currentPage(), this.pageSize())
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (page) => {
          this.requests.set(page.content);
          this.totalPages.set(page.totalPages);
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

  isAccessApprover(): boolean {
    return this.userService.hasPermission(PERMISSIONS.REQUEST_ACCESS_APPROVE);
  }

  onCreateNew(): void {
    this.router.navigate(['/access-requests/create']);
  }

  onViewDetails(requestId: number): void {
    this.router.navigate(['/access-requests', requestId]);
  }

  onCancel(requestId: number): void {
    this.confirmationDialog.confirm({
      title: 'Cancel Request',
      message: 'Are you sure you want to cancel this access request? This action cannot be undone.',
      actionLabel: 'Cancel Request',
      cancelLabel: 'Keep Request',
      isDestructive: true
    }).subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      this.accessRequestService.cancelAccessRequest(requestId)
        .subscribe({
          next: () => {
            this.snackBar.open('Request cancelled successfully', 'Close', { duration: 3000 });
            this.loadRequests();
          },
          error: (err) => {
            this.snackBar.open('Failed to cancel request', 'Close', { duration: 5000 });
            console.error('Error cancelling request:', err);
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
}
