import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AuthProvider } from '../../../core/enums/auth-provider.enum';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { Oauth2Service } from '../../../core/services/oauth2.service';
import { PasswordVisibilityDirective } from '../../../shared/directives/password-visibility.directive';
import { PasswordVisibilityToggleComponent } from '../../../shared/components/password-visibility-toggle/password-visibility-toggle.component';
import { NavigationTransitionService } from '../../../core/services/navigation-transition.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormField,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    PasswordVisibilityDirective,
    PasswordVisibilityToggleComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly oauth2Service = inject(Oauth2Service);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly navigationTransition = inject(NavigationTransitionService);
  readonly isLoading = signal(false);
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  readonly controls = this.form.controls;

  onSubmit(): void {
    if (this.isLoading() || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();

    this.isLoading.set(true);
    this.form.disable({ emitEvent: false });
    this.authService.login({ email, password })
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
          this.form.enable({ emitEvent: false });
        })
      )
      .subscribe({
        next: () => {
          sessionStorage.setItem('verificationSource', 'login');
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          const targetUrl = returnUrl && returnUrl.startsWith('/') ? returnUrl : '/';
          this.navigationTransition.navigateByUrl(this.router, targetUrl);
        },
        error: () => {}
      });
  }

  register(): void {
    this.navigationTransition.navigate(this.router, ['/register']);
  }

  forgotPassword(): void {
    this.navigationTransition.navigate(this.router, ['/forgot-password']);
  }

  loginWithGoogle(): void {
    this.oauth2Service.login(AuthProvider.GOOGLE);
  }

  loginWithGithub(): void {
    this.oauth2Service.login(AuthProvider.GITHUB);
  }
}
