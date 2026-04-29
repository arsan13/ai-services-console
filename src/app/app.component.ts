import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from './core/services/auth.service';
import { UserMenuComponent } from './shared/components/user-menu/user-menu.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, UserMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private readonly auth = inject(AuthService);

  constructor() {
    this.auth.initializeUser().subscribe();
  }
}
