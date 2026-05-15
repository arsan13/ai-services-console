import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { PERMISSIONS } from '../models/permission.model';

export const requestAccessApprovalGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const currentUser = userService.currentUser();

  if (!currentUser) {
    return router.parseUrl('/login');
  }

  const hasApprovalPermission = userService.hasPermission(PERMISSIONS.REQUEST_ACCESS_APPROVE);

  if (!hasApprovalPermission) {
    router.navigate(['/access-requests/my-requests']);
    return false;
  }

  return true;
};
