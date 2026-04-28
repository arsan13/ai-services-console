import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { finalize } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
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
  fullname = '';
  username = '';
  password = '';
  isLoading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.isLoading = true;
    this.auth.register({
      fullname: this.fullname,
      username: this.username,
      password: this.password
    }).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
        next: res => {
          this.auth.saveToken(res.token);
          this.router.navigate(['/']);
        }
      });
  }

  login() {
    this.router.navigate(['/login']);
  }
}
