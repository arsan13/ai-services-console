import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-verify-email',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifyEmailComponent {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly token = this.route.snapshot.queryParamMap.get('token')?.trim() ?? '';

  readonly isLoading = signal(true);
  readonly isVerified = signal(false);
  readonly isAlreadyVerified = signal(false);
  readonly hasTokenError = signal(this.token.length === 0);
  readonly verificationError = signal<string | null>(null);

  constructor() {
    if (this.token && isPlatformBrowser(this.platformId)) {
      this.verifyEmail();
    } else {
      this.isLoading.set(false);
    }
  }

  private verifyEmail(): void {
    this.authService.verifyEmail({ token: this.token }).pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: () => {
        this.markVerifiedAndRedirect();
      },
      error: (err) => {
        const message = err.message || 'Email verification failed. Please try again.';

        if (message.toLowerCase().includes('already verified')) {
          this.verificationError.set(null);
          this.isAlreadyVerified.set(true);
          setTimeout(() => this.router.navigate(['/chat']), 3000);
          return;
        }

        this.verificationError.set(message);
      }
    });
  }

  private markVerifiedAndRedirect(): void {
    const user = this.userService.currentUser();
    if (user && !user.verified) {
      this.userService.set({ ...user, verified: true });
    }

    this.verificationError.set(null);
    this.isAlreadyVerified.set(false);
    this.isVerified.set(true);
    setTimeout(() => this.router.navigate(['/chat']), 3000);
  }

  goToChat(): void {
    this.router.navigate(['/chat']);
  }

  get backActionLabel(): string {
    return this.authService.isLoggedIn() ? 'Back to Home' : 'Back to Login';
  }

  goBack(): void {
    this.router.navigate([this.authService.isLoggedIn() ? '/' : '/login']);
  }
}
