import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../../core/services/user.service';
import { PERMISSIONS } from '../../../core/models/permission.model';

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
  private readonly userService = inject(UserService);

  get tabs(): ToolbarTab[] {
    const hasApprovePermission = this.userService.hasPermission(PERMISSIONS.REQUEST_ACCESS_APPROVE);
    const hasViewPermission = this.userService.hasPermission(PERMISSIONS.REQUEST_ACCESS_VIEW);

    const tabs: ToolbarTab[] = [
      {
        label: 'Chat',
        route: '/chat',
        exact: true
      }
    ];

    if (!hasApprovePermission) {
      tabs.push({
        label: 'My Requests',
        route: '/access-requests/my-requests',
        exact: false
      });
    }

    if (hasApprovePermission) {
      tabs.push({
        label: 'View Requests',
        route: '/access-requests/admin',
        exact: false
      });
    } else if (hasViewPermission) {
      tabs.push({
        label: 'View Requests',
        route: '/access-requests/viewer',
        exact: false
      });
    }

    return tabs;
  }
}
