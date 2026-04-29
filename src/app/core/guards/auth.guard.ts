import { isPlatformBrowser } from "@angular/common";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  private platformId = inject(PLATFORM_ID);

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}