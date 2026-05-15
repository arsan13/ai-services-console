import { isPlatformBrowser } from "@angular/common";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { map, Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  private platformId = inject(PLATFORM_ID);

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> {
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }

    if (!this.auth.isLoggedIn()) {
      return this.router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url }
      });
    }

    return this.auth.initializeUser().pipe(
      map(user => (user ? true : this.router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url }
      })))
    );
  }
}