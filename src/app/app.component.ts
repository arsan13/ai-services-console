import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from './core/services/auth.service';
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

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  constructor() {
    this.auth.initializeUser().subscribe();
  }
}
