import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';

const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPasswordControl = control.get('confirmPassword');
  const confirmPassword = confirmPasswordControl?.value;

  if (!confirmPasswordControl) {
    return null;
  }

  const currentErrors = confirmPasswordControl.errors ?? {};
  const { passwordMismatch, ...otherErrors } = currentErrors;

  const shouldCheckMismatch = !!password && !!confirmPassword;

  if (!shouldCheckMismatch) {
    confirmPasswordControl.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
    return null;
  }

  if (password !== confirmPassword) {
    confirmPasswordControl.setErrors({ ...otherErrors, passwordMismatch: true });
    return { passwordMismatch: true };
  }

  confirmPasswordControl.setErrors(Object.keys(otherErrors).length ? otherErrors : null);

  return null;
};

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormField,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly isLoading = signal(false);
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.nonNullable.group({
    fullname: ['', [Validators.required, Validators.minLength(2)]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
  }, {
    validators: passwordMatchValidator
  });
  readonly controls = this.form.controls;

  onSubmit(): void {
    if (this.isLoading() || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { fullname, username, password } = this.form.getRawValue();

    this.isLoading.set(true);
    this.form.disable({ emitEvent: false });
    this.authService.register({
      fullname,
      username,
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
      error: () => {}
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  isPasswordMismatchVisible(): boolean {
    const passwordTouched = this.controls.password.touched || this.controls.password.dirty;
    const confirmTouched = this.controls.confirmPassword.touched || this.controls.confirmPassword.dirty;

    return (passwordTouched || confirmTouched) && this.controls.confirmPassword.hasError('passwordMismatch');
  }
}
