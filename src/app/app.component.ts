import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from './core/services/auth.service';
import { UserService } from './core/services/user.service';
import { UserProfile } from './core/models/auth.model';
import { UserMenuComponent } from './shared/components/user-menu/user-menu.component';
import { AppTabsComponent } from './shared/components/app-tabs/app-tabs.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, MatToolbarModule, UserMenuComponent, AppTabsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  protected readonly auth = inject(AuthService);
  protected readonly userService = inject(UserService);

  get currentUser(): UserProfile | null {
    return this.userService.currentUser();
  }

  constructor() {
    this.auth.initializeUser().subscribe();
  }
}
