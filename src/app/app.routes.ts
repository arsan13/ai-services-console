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
    path: 'oauth-error',
    loadComponent: () => import('./features/auth/oauth-error/oauth-error.component').then((m) => m.OauthErrorComponent)
  },
  {
    path: 'oauth-success',
    loadComponent: () => import('./features/auth/oauth-success/oauth-success.component').then((m) => m.OauthSuccessComponent)
  },
  {
    path: 'chat',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/chat/chat/chat.component').then((m) => m.ChatComponent)
  }
];
