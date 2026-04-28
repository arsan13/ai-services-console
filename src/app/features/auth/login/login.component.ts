import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AuthProvider } from '../../../core/enums/auth-provider.enum';
import { finalize } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
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
  username = '';
  password = '';
  isLoading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.isLoading = true;
    this.auth.login({ username: this.username, password: this.password })
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe({
        next: res => {
          this.auth.saveToken(res.token);
          this.router.navigate(['/']);
        }
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
