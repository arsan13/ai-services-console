import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class PublicOnlyGuard implements CanActivate {
  private readonly platformId = inject(PLATFORM_ID);

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> {
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }

    if (!this.auth.isLoggedIn()) {
      return true;
    }

    return this.auth.initializeUser().pipe(
      map(user => (user ? this.router.createUrlTree(['/']) : true))
    );
  }
}