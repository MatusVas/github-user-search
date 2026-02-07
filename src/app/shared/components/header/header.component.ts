import { Component, computed, signal, effect } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';
import { GithubApiService } from '../../../core/services/github-api.service';
import { UserProfile } from '../../../core/models/github-user.model';
import { IconComponent } from '../icon/icon.component';

/**
 * Header component with logo, theme toggle, and authentication controls
 * Displays the application name, allows users to switch between light/dark themes,
 * and shows login/logout buttons with user profile information
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  userProfile = signal<UserProfile | null>(null);

  constructor(
    public themeService: ThemeService,
    public authService: AuthService,
    private githubApi: GithubApiService
  ) {
    // Load user profile when authenticated
    effect(() => {
      if (this.authService.isAuthenticated()) {
        this.loadUserProfile();
      } else {
        this.userProfile.set(null);
      }
    });
  }

  themeLabel = computed(() => this.themeService.theme() === 'light' ? 'DARK' : 'LIGHT');
  themeIcon = computed(() => this.themeService.theme() === 'light' ? 'moon' : 'sun');
  isAuthenticated = computed(() => this.authService.isAuthenticated());

  private loadUserProfile(): void {
    this.githubApi.getAuthenticatedUser().subscribe({
      next: (profile) => this.userProfile.set(profile),
      error: (err) => console.error('Failed to load user profile:', err)
    });
  }

  onLogin(): void {
    this.authService.login();
  }

  onLogout(): void {
    this.authService.logout();
  }

  onThemeToggle(): void {
    this.themeService.toggleTheme();
  }
}
