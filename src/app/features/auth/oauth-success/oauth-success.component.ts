import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-oauth-success',
  templateUrl: './oauth-success.component.html',
  styleUrl: './oauth-success.component.css',
})
export class OauthSuccessComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly snackBar = inject(MatSnackBar);

  message = 'Signing you in...';

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      const errorMessage = 'Login failed. Missing token.';
      this.message = `${errorMessage} Redirecting to login...`;
      this.showError(errorMessage);
      void this.router.navigate(['/login'], { replaceUrl: true });
      return;
    }

    this.authService.saveToken(token);
    this.message = 'Login successful. Redirecting...';
    void this.router.navigate(['/chat'], { replaceUrl: true });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['app-error-snackbar']
    });
  }
}
