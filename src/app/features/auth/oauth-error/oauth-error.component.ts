import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-oauth-error',
  templateUrl: './oauth-error.component.html',
  styleUrl: './oauth-error.component.css',
})
export class OauthErrorComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly snackBar = inject(MatSnackBar);

  message = 'Authentication failed. Redirecting to login...';

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const backendMessage = this.route.snapshot.queryParamMap.get('message');
    const errorMessage = backendMessage?.trim() || 'Authentication failed';

    this.message = `${errorMessage} Redirecting to login...`;
    this.snackBar.open(errorMessage, 'Dismiss', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['app-error-snackbar']
    });

    void this.router.navigate(['/login'], { replaceUrl: true });
  }
}
