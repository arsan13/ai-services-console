import { Routes } from '@angular/router';
import { ChatComponent } from './features/chat/chat/chat.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { OauthErrorComponent } from './features/auth/oauth-error/oauth-error.component';
import { OauthSuccessComponent } from './features/auth/oauth-success/oauth-success.component';
import { PublicOnlyGuard } from './core/guards/public-only.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/chat', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [PublicOnlyGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [PublicOnlyGuard] },
  { path: 'oauth-error', component: OauthErrorComponent },
  { path: 'oauth-success', component: OauthSuccessComponent },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] }
];
