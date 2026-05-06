import { Directive, signal } from '@angular/core';

@Directive({
  selector: 'input[appPasswordVisibility]',
  exportAs: 'appPasswordVisibility',
  host: {
    '[type]': 'visible() ? "text" : "password"'
  }
})
export class PasswordVisibilityDirective {
  readonly visible = signal(false);

  toggle(): void {
    this.visible.update((value) => !value);
  }
}