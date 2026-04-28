import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    MatCardModule,
    MatFormField,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.auth.login({ username: this.username, password: this.password })
      .subscribe(res => {
        this.auth.saveToken(res.token);
        this.router.navigate(['/']);
      });
  }

  register() {
    this.router.navigate(['/register']);
  }

  loginWithGoogle() {
    this.auth.oauth2Login('google');
  }

  loginWithGithub() {
    this.auth.oauth2Login('github');
  }
}
