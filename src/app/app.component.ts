import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from './core/services/auth.service';
import { UserService } from './core/services/user.service';
import { UserProfile } from './core/models/auth.model';
import { UserMenuComponent } from './shared/components/user-menu/user-menu.component';
import { AppTabsComponent } from './shared/components/app-tabs/app-tabs.component';
import { ThemeService } from './core/services/theme.service';
import { ThemeToggleComponent } from './shared/components/theme-toggle/theme-toggle.component';
import { VerificationBannerComponent } from './shared/components/verification-banner/verification-banner.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    UserMenuComponent,
    AppTabsComponent,
    ThemeToggleComponent,
    VerificationBannerComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  protected readonly auth = inject(AuthService);
  protected readonly userService = inject(UserService);
  private readonly themeService = inject(ThemeService);
  protected readonly showVerificationBanner = signal(false);
  protected readonly verificationBannerSource = signal<'register' | 'login'>('register');
  protected readonly resendLoading = signal(false);
  protected readonly resendStatus = signal<'idle' | 'success' | 'error'>('idle');
  protected readonly resendStatusMessage = signal('');

  get currentUser(): UserProfile | null {
    return this.userService.currentUser();
  }

  get shouldShowVerificationBanner(): boolean {
    const user = this.currentUser;
    return !!user && !user.verified && this.showVerificationBanner();
  }

  constructor() {
    this.themeService.initialize();

    effect(() => {
      const user = this.userService.currentUser();
      if (!user || user.verified) {
        this.showVerificationBanner.set(false);
        this.resendStatus.set('idle');
        this.resendStatusMessage.set('');
        return;
      }

      const source = (sessionStorage.getItem('verificationSource') as 'register' | 'login') || 'login';
      this.verificationBannerSource.set(source);
      this.showVerificationBanner.set(true);
      sessionStorage.removeItem('verificationSource');
    });

    this.auth.initializeUser().subscribe({
      next: (user) => {
        if (user && !user.verified) {
          const source = (sessionStorage.getItem('verificationSource') as 'register' | 'login') || 'login';
          this.verificationBannerSource.set(source);
          this.showVerificationBanner.set(true);
          sessionStorage.removeItem('verificationSource');
        }
      }
    });
  }

  onBannerDismissed(): void {
    this.showVerificationBanner.set(false);
  }

  onResendVerification(): void {
    const user = this.currentUser;
    if (!user || this.resendLoading()) return;

    this.resendStatus.set('idle');
    this.resendStatusMessage.set('');
    this.resendLoading.set(true);
    this.auth.resendVerificationEmail({ email: user.email }).subscribe({
      next: () => {
        this.resendLoading.set(false);
        this.resendStatus.set('success');
        this.resendStatusMessage.set('Verification email sent. Please check your inbox.');
      },
      error: () => {
        this.resendLoading.set(false);
        this.resendStatus.set('error');
        this.resendStatusMessage.set('Unable to send verification email right now. Please try again.');
      }
    });
  }
}
