import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class NavigationTransitionService {
  private static readonly TRANSITION_CLASS = 'app-route-transition-out';
  private static readonly TRANSITION_DELAY_MS = 260;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  navigate(router: Router, commands: readonly string[], extras?: NavigationExtras): Promise<boolean> {
    return this.performTransition(() => router.navigate(commands, extras));
  }

  navigateByUrl(router: Router, url: string, extras?: NavigationExtras): Promise<boolean> {
    return this.performTransition(() => router.navigateByUrl(url, extras));
  }

  private async performTransition(navigate: () => Promise<boolean>): Promise<boolean> {
    const canAnimate = isPlatformBrowser(this.platformId);
    const body = this.document.body;

    if (!canAnimate) {
      return navigate();
    }

    body.classList.add(NavigationTransitionService.TRANSITION_CLASS);
    await this.delay(NavigationTransitionService.TRANSITION_DELAY_MS);

    try {
      return await navigate();
    } finally {
      requestAnimationFrame(() => body.classList.remove(NavigationTransitionService.TRANSITION_CLASS));
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}