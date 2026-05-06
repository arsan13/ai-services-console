import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, debounceTime, distinctUntilChanged, finalize, of, switchMap, tap } from 'rxjs';
import { passwordMatchValidator } from '../validators/password-match.validator';
import { AuthProvider } from '../../../core/enums/auth-provider.enum';
import { Oauth2Service } from '../../../core/services/oauth2.service';
import { PasswordVisibilityDirective } from '../../../shared/directives/password-visibility.directive';
import { PasswordVisibilityToggleComponent } from '../../../shared/components/password-visibility-toggle/password-visibility-toggle.component';

type EmailAvailabilityStatus = 'idle' | 'checking' | 'available' | 'unavailable';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    PasswordVisibilityDirective,
    PasswordVisibilityToggleComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly oauth2Service = inject(Oauth2Service);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  readonly isLoading = signal(false);
  readonly emailAvailabilityStatus = signal<EmailAvailabilityStatus>('idle');

  readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
  }, {
    validators: passwordMatchValidator()
  });
  readonly controls = this.form.controls;

  constructor() {
    this.watchEmailAvailability();
  }

  onSubmit(): void {
    if (this.isLoading() || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { fullName, email, password } = this.form.getRawValue();
    sessionStorage.setItem('verificationSource', 'register');

    this.isLoading.set(true);
    this.form.disable({ emitEvent: false });
    this.authService.register({
      fullName,
      email,
      password
    }).pipe(
      finalize(() => {
        this.isLoading.set(false);
        this.form.enable({ emitEvent: false });
      })
    ).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        sessionStorage.removeItem('verificationSource');
      }
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  registerWithGoogle(): void {
    this.oauth2Service.login(AuthProvider.GOOGLE);
  }

  registerWithGithub(): void {
    this.oauth2Service.login(AuthProvider.GITHUB);
  }

  isRegisterDisabled(): boolean {
    return this.isLoading() || this.emailAvailabilityStatus() === 'checking' || this.controls.email.hasError('emailUnavailable');
  }

  isPasswordMismatchVisible(): boolean {
    const passwordTouched = this.controls.password.touched || this.controls.password.dirty;
    const confirmTouched = this.controls.confirmPassword.touched || this.controls.confirmPassword.dirty;

    return (passwordTouched || confirmTouched) && this.controls.confirmPassword.hasError('passwordMismatch');
  }

  private watchEmailAvailability(): void {
    const emailControl = this.controls.email;

    emailControl.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap((rawEmail) => {
        const normalizedEmail = rawEmail.trim().toLowerCase();

        this.emailAvailabilityStatus.set('idle');
        this.updateEmailUnavailableError(false);

        if (!normalizedEmail || emailControl.hasError('required') || emailControl.hasError('email')) {
          return of(null);
        }

        this.emailAvailabilityStatus.set('checking');

        return this.authService.checkEmailAvailability(normalizedEmail).pipe(
          tap((isAvailable) => {
            this.emailAvailabilityStatus.set(isAvailable ? 'available' : 'unavailable');
            this.updateEmailUnavailableError(!isAvailable);
          }),
          catchError(() => {
            this.emailAvailabilityStatus.set('idle');
            this.updateEmailUnavailableError(false);
            return of(null);
          })
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  private updateEmailUnavailableError(isUnavailable: boolean): void {
    const errors = this.controls.email.errors;

    if (isUnavailable) {
      if (errors?.['emailUnavailable']) {
        return;
      }

      this.controls.email.setErrors({
        ...(errors ?? {}),
        emailUnavailable: true
      });
      return;
    }

    if (!errors?.['emailUnavailable']) {
      return;
    }

    const { emailUnavailable, ...remainingErrors } = errors;
    this.controls.email.setErrors(Object.keys(remainingErrors).length > 0 ? remainingErrors : null);
  }
}
