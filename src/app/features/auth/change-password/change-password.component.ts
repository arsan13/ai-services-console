import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../../core/services/user.service';
import { passwordMatchValidator } from '../validators/password-match.validator';
import { PasswordVisibilityDirective } from '../../../shared/directives/password-visibility.directive';
import { PasswordVisibilityToggleComponent } from '../../../shared/components/password-visibility-toggle/password-visibility-toggle.component';

@Component({
  selector: 'app-change-password',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    PasswordVisibilityDirective,
    PasswordVisibilityToggleComponent
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly isLoading = signal(false);
  readonly isCompleted = signal(false);

  readonly form = this.fb.nonNullable.group({
    currentPassword: ['', [Validators.required, Validators.minLength(6)]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
  }, {
    validators: passwordMatchValidator('newPassword', 'confirmPassword')
  });

  readonly controls = this.form.controls;

  onSubmit(): void {
    if (this.isLoading() || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword } = this.form.getRawValue();

    this.isLoading.set(true);
    this.form.disable({ emitEvent: false });

    this.userService.changePassword({ currentPassword, newPassword }).pipe(
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

  goToChat(): void {
    this.router.navigate(['/chat']);
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
