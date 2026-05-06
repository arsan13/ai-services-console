import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PasswordVisibilityDirective } from '../../directives/password-visibility.directive';

@Component({
  selector: 'app-password-visibility-toggle',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './password-visibility-toggle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordVisibilityToggleComponent {
  readonly passwordVisibility = input.required<PasswordVisibilityDirective>();
  readonly controlLabel = input('password');
}