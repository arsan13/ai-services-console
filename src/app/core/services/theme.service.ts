import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

export type AppTheme = 'light' | 'dark';

const DEFAULT_THEME: AppTheme = 'dark';
const THEME_STORAGE_KEY = 'app-theme';
const THEME_CLASS_MAP: Record<AppTheme, string> = {
  light: 'app-theme-light',
  dark: 'app-theme-dark',
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly themeSignal = signal<AppTheme>(DEFAULT_THEME);
  readonly theme = this.themeSignal.asReadonly();

  private initialized = false;

  initialize(): void {
    if (this.initialized) {
      return;
    }

    this.setTheme(this.readInitialTheme());
    this.initialized = true;
  }

  toggleTheme(): void {
    const nextTheme: AppTheme = this.themeSignal() === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }

  setTheme(theme: AppTheme): void {
    this.themeSignal.set(theme);
    this.applyThemeClass(theme);
    this.persistTheme(theme);
  }

  isDarkTheme(): boolean {
    return this.themeSignal() === 'dark';
  }

  private readInitialTheme(): AppTheme {
    // Default is intentionally dark for first-time users.
    if (!isPlatformBrowser(this.platformId)) {
      return DEFAULT_THEME;
    }

    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    return DEFAULT_THEME;
  }

  private applyThemeClass(theme: AppTheme): void {
    const root = this.document.documentElement;
    root.classList.remove(THEME_CLASS_MAP.light, THEME_CLASS_MAP.dark);
    root.classList.add(THEME_CLASS_MAP[theme]);
  }

  private persistTheme(theme: AppTheme): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
}
