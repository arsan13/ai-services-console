import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { passwordMatchValidator } from '../validators/password-match.validator';
import { AuthProvider } from '../../../core/enums/auth-provider.enum';

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
  private readonly fb = inject(FormBuilder);
  readonly isLoading = signal(false);

  readonly form = this.fb.nonNullable.group({
    fullname: ['', [Validators.required, Validators.minLength(2)]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
  }, {
    validators: passwordMatchValidator()
  });
  readonly controls = this.form.controls;

  onSubmit(): void {
    if (this.isLoading() || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { fullname, username, password } = this.form.getRawValue();

    this.startLoading();
    this.authService.register({
      fullname,
      username,
      password
    }).pipe(
      finalize(() => this.stopLoading())
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

  registerWithGoogle(): void {
    this.authService.oauth2Login(AuthProvider.GOOGLE);
  }

  registerWithGithub(): void {
    this.authService.oauth2Login(AuthProvider.GITHUB);
  }

  isPasswordMismatchVisible(): boolean {
    const passwordTouched = this.isControlInteracted(this.controls.password);
    const confirmTouched = this.isControlInteracted(this.controls.confirmPassword);

    return (passwordTouched || confirmTouched) && this.controls.confirmPassword.hasError('passwordMismatch');
  }

  private startLoading(): void {
    this.isLoading.set(true);
    this.form.disable({ emitEvent: false });
  }

  private stopLoading(): void {
    this.isLoading.set(false);
    this.form.enable({ emitEvent: false });
  }

  private isControlInteracted(control: AbstractControl): boolean {
    return control.touched || control.dirty;
  }
}
