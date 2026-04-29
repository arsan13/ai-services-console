import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AuthProvider } from '../../../core/enums/auth-provider.enum';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormField,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  readonly isLoading = signal(false);
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.isLoading() || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { username, password } = this.form.getRawValue();

    this.isLoading.set(true);
    this.form.disable({ emitEvent: false });
    this.auth.login({ username, password })
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
          this.form.enable({ emitEvent: false });
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: () => {}
      });
  }

  register() {
    this.router.navigate(['/register']);
  }

  loginWithGoogle() {
    this.auth.oauth2Login(AuthProvider.GOOGLE);
  }

  loginWithGithub() {
    this.auth.oauth2Login(AuthProvider.GITHUB);
  }
}
