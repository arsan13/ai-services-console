import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verification-banner',
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="verification-banner" role="status" aria-live="polite" aria-label="Email verification reminder">
      <div class="banner-content">
        <mat-icon class="banner-icon">mail_outline</mat-icon>
        <div class="banner-text">
          <p class="banner-title">Verify your email</p>
          @if (source() === 'register') {
            <p class="banner-message">Activate your account to access the features. Check your inbox for a verification link to fully activate your account.</p>
          } @else {
            <p class="banner-message">
              Activate your account to access the features by verifying your email.
              <a
                href="#"
                (click)="resendVerification($event)"
                class="resend-link"
                [class.resend-link-disabled]="resendLoading()"
                [attr.aria-disabled]="resendLoading()"
              >
                {{ resendLoading() ? 'Sending verification link...' : 'Resend verification link' }}
              </a>
            </p>
            @if (resendStatus() !== 'idle' && resendStatusMessage()) {
              <p class="resend-status" [class.resend-status-success]="resendStatus() === 'success'" [class.resend-status-error]="resendStatus() === 'error'">
                {{ resendStatusMessage() }}
              </p>
            }
          }
        </div>
      </div>
      <button mat-icon-button (click)="onDismiss()" aria-label="Dismiss verification reminder" class="dismiss-btn">
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .verification-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.75rem 1rem;
      background: linear-gradient(
        90deg,
        color-mix(in srgb, var(--mat-sys-warning-container) 86%, transparent),
        color-mix(in srgb, var(--mat-sys-warning-container) 42%, transparent)
      );
      border-bottom: 1px solid color-mix(in srgb, var(--mat-sys-outline) 32%, transparent);
      color: var(--mat-sys-on-surface);
    }

    .banner-content {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      flex: 1;
    }

    .banner-icon {
      margin-top: 2px;
      color: color-mix(in srgb, var(--mat-sys-warning) 72%, transparent);
      flex-shrink: 0;
    }

    .banner-text {
      display: grid;
      gap: 0.25rem;
    }

    .banner-title {
      margin: 0;
      font-weight: 500;
      font-size: 0.95rem;
    }

    .banner-message {
      margin: 0;
      font-size: 0.85rem;
      color: color-mix(in srgb, var(--mat-sys-on-surface) 72%, transparent);
    }

    .dismiss-btn {
      flex-shrink: 0;
      margin: -4px -8px -4px 0;
    }

    .resend-link {
      color: var(--mat-sys-primary);
      text-decoration: none;
      font-weight: 500;
      cursor: pointer;
      border-bottom: 1px solid var(--mat-sys-primary);
    }

    .resend-link-disabled {
      pointer-events: none;
      opacity: 0.65;
      border-bottom-color: color-mix(in srgb, var(--mat-sys-primary) 65%, transparent);
    }

    .resend-link:hover {
      text-decoration: underline;
    }

    .resend-status {
      margin: 0;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .resend-status-success {
      color: color-mix(in srgb, var(--mat-sys-primary) 88%, transparent);
    }

    .resend-status-error {
      color: color-mix(in srgb, var(--mat-sys-error) 90%, transparent);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerificationBannerComponent {
  readonly source = input<'register' | 'login'>('register');
  readonly resendLoading = input(false);
  readonly resendStatus = input<'idle' | 'success' | 'error'>('idle');
  readonly resendStatusMessage = input('');
  readonly dismissed = output<void>();
  readonly resendClicked = output<void>();

  onDismiss(): void {
    this.dismissed.emit();
  }

  resendVerification(event: Event): void {
    event.preventDefault();
    if (this.resendLoading()) {
      return;
    }
    this.resendClicked.emit();
  }
}
