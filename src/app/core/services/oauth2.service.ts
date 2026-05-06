import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthProvider } from '../enums/auth-provider.enum';
import { UserProfile } from '../models/auth.model';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class Oauth2Service {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly oauth2ApiUrl = `${environment.apiUrl}/oauth2`;
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);

  login(provider: AuthProvider): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    window.location.href = `${this.oauth2ApiUrl}/${provider}`;
  }

  completeLogin(token: string): Observable<UserProfile | null> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(null);
    }

    this.authService.setSessionToken(token);
    return this.userService.load();
  }
}