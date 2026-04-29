import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-menu',
  imports: [MatButtonModule, MatMenuModule, MatIconModule, MatDividerModule],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss'
})
export class UserMenuComponent {
  protected readonly userService = inject(UserService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
