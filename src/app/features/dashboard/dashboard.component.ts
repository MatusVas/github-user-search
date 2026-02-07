import { Component, OnInit, signal } from '@angular/core';
import { GithubApiService } from '../../core/services/github-api.service';
import { Repository } from '../../core/models/github-user.model';
import { HeaderComponent } from '../../shared/components/header/header.component';

/**
 * Dashboard component for displaying authenticated user's repositories
 * Shows top 10 repositories sorted by last updated date
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  repositories = signal<Repository[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  constructor(private githubApi: GithubApiService) {}

  ngOnInit(): void {
    this.loadRepositories();
  }

  private loadRepositories(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.githubApi.getUserRepositories('updated', 10).subscribe({
      next: (repos) => {
        this.repositories.set(repos);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load repositories');
        this.isLoading.set(false);
      }
    });
  }
}
