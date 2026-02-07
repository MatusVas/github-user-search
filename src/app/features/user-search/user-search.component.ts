import { Component, signal } from '@angular/core';
import { GitHubUser } from '../../core/models/github-user.model';
import { GithubApiService } from '../../core/services/github-api.service';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { UserProfileCardComponent } from '../../shared/components/user-profile-card/user-profile-card.component';

/**
 * Main feature component for GitHub user search
 * Smart container that manages state and orchestrates child components
 */
@Component({
  selector: 'app-user-search',
  standalone: true,
  imports: [
    HeaderComponent,
    SearchBarComponent,
    UserProfileCardComponent
  ],
  templateUrl: './user-search.component.html',
  styleUrl: './user-search.component.css'
})
export class UserSearchComponent {
  userData = signal<GitHubUser | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  constructor(private githubApi: GithubApiService) {}

  onSearch(username: string): void {
    // Clear results if search is empty
    if (!username.trim()) {
      this.userData.set(null);
      this.error.set(null);
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);
    this.userData.set(null);

    this.githubApi.getUserByUsername(username).subscribe({
      next: (user) => {
        this.userData.set(user);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'An error occurred');
        this.isLoading.set(false);
      }
    });
  }
}
