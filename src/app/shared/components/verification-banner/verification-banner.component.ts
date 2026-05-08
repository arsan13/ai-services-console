import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verification-banner',
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: 'verification-banner.component.html',
  styleUrl: 'verification-banner.component.scss',
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
