import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';
import { passwordMatchValidator } from '../validators/password-match.validator';

@Component({
  selector: 'app-reset-password',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly resetToken = this.route.snapshot.queryParamMap.get('token')?.trim() ?? '';

  readonly isLoading = signal(false);
  readonly isCompleted = signal(false);
  readonly hasResetToken = signal(this.resetToken.length > 0);

  readonly form = this.fb.nonNullable.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
  }, {
    validators: passwordMatchValidator('newPassword', 'confirmPassword')
  });

  readonly controls = this.form.controls;

  onSubmit(): void {
    if (this.isLoading() || !this.hasResetToken() || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { newPassword } = this.form.getRawValue();

    this.isLoading.set(true);
    this.form.disable({ emitEvent: false });

    this.authService.resetPassword({ token: this.resetToken, newPassword }).pipe(
      finalize(() => {
        this.isLoading.set(false);
        this.form.enable({ emitEvent: false });
      })
    ).subscribe({
      next: () => {
        this.isCompleted.set(true);
      },
      error: () => {}
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  isPasswordMismatchVisible(): boolean {
    const newPasswordTouched = this.isControlInteracted(this.controls.newPassword);
    const confirmTouched = this.isControlInteracted(this.controls.confirmPassword);

    return (newPasswordTouched || confirmTouched) && this.controls.confirmPassword.hasError('passwordMismatch');
  }

  private isControlInteracted(control: AbstractControl): boolean {
    return control.touched || control.dirty;
  }
}
