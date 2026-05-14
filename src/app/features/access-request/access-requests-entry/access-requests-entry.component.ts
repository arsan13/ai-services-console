import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { PERMISSIONS } from '../../../core/models/permission.model';

@Component({
  selector: 'app-access-requests-entry',
  template: ''
})
export class AccessRequestsEntryComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    const hasApprovePermission = this.userService.hasPermission(PERMISSIONS.REQUEST_ACCESS_APPROVE);
    const hasViewAllPermission = this.userService.hasPermission(PERMISSIONS.REQUEST_ACCESS_VIEW);

    let target: string;
    if (hasApprovePermission) {
      // Admin: can view all and approve/reject/revoke
      target = '/access-requests/admin';
    } else if (hasViewAllPermission) {
      // Viewer: can view all requests but not approve
      target = '/access-requests/viewer';
    } else {
      // Regular user: can only view own requests
      target = '/access-requests/my-requests';
    }

    this.router.navigateByUrl(target, { replaceUrl: true });
  }
}
