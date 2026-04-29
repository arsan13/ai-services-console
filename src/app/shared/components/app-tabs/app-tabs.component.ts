import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

type ToolbarTab = {
  label: string;
  route: string;
  exact?: boolean;
};

@Component({
  selector: 'app-tabs',
  imports: [RouterLink, RouterLinkActive, MatButtonModule],
  templateUrl: './app-tabs.component.html',
  styleUrl: './app-tabs.component.scss'
})
export class AppTabsComponent {
  readonly tabs: ToolbarTab[] = [
    {
      label: 'Chat',
      route: '/chat',
      exact: true
    }
  ];
}
