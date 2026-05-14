import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { PublicOnlyGuard } from './core/guards/public-only.guard';
import { requestAccessApprovalGuard } from './core/guards/request-access-approval.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/chat', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [PublicOnlyGuard],
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'register',
    canActivate: [PublicOnlyGuard],
    loadComponent: () => import('./features/auth/register/register.component').then((m) => m.RegisterComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./features/auth/reset-password/reset-password.component').then((m) => m.ResetPasswordComponent)
  },
  {
    path: 'verify-email',
    loadComponent: () => import('./features/auth/verify-email/verify-email.component').then((m) => m.VerifyEmailComponent)
  },
  {
    path: 'oauth-error',
    loadComponent: () => import('./features/auth/oauth-error/oauth-error.component').then((m) => m.OauthErrorComponent)
  },
  {
    path: 'oauth-success',
    loadComponent: () => import('./features/auth/oauth-success/oauth-success.component').then((m) => m.OauthSuccessComponent)
  },
  {
    path: 'change-password',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/auth/change-password/change-password.component').then((m) => m.ChangePasswordComponent)
  },
  {
    path: 'chat',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/chat/chat/chat.component').then((m) => m.ChatComponent)
  },
  {
    path: 'access-requests',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./features/access-request/access-requests-entry/access-requests-entry.component').then((m) => m.AccessRequestsEntryComponent)
      },
      {
        path: 'create',
        loadComponent: () => import('./features/access-request/create-access-request/create-access-request.component').then((m) => m.CreateAccessRequestComponent)
      },
      {
        path: 'my-requests',
        loadComponent: () => import('./features/access-request/my-access-requests/my-access-requests.component').then((m) => m.MyAccessRequestsComponent)
      },
      {
        path: 'admin',
        canActivate: [requestAccessApprovalGuard],
        loadComponent: () => import('./features/access-request/admin-approvals/admin-approvals.component').then((m) => m.AdminApprovalsComponent)
      },
      {
        path: 'viewer',
        loadComponent: () => import('./features/access-request/viewer-approvals/viewer-approvals.component').then((m) => m.ViewerApprovalsComponent)
      }
    ]
  }
];
