import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { PublicOnlyGuard } from './core/guards/public-only.guard';

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
  }
];
