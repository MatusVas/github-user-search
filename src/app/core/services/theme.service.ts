import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

/**
 * Service for managing application theme (light/dark mode)
 * Persists theme preference to localStorage and syncs with system preference
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  theme = signal<Theme>('light');

  constructor() {
    this.initializeTheme();
  }

  /**
   * Initializes theme from localStorage or system preference
   */
  private initializeTheme(): void {
    // 1. Check localStorage for saved preference
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
      this.setTheme(saved);
      return;
    }

    // 2. Fall back to system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.setTheme(prefersDark ? 'dark' : 'light');
  }

  /**
   * Toggles between light and dark themes
   */
  toggleTheme(): void {
    const newTheme: Theme = this.theme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Sets the theme and persists it
   * @param theme Theme to set ('light' or 'dark')
   */
  private setTheme(theme: Theme): void {
    this.theme.set(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
}
