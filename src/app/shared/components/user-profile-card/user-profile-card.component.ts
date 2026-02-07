import { Component, Input } from '@angular/core';
import { GitHubUser } from '../../../core/models/github-user.model';
import { IconComponent } from '../icon/icon.component';

/**
 * User profile card component
 * Displays GitHub user information including avatar, bio, stats, and links
 */
@Component({
  selector: 'app-user-profile-card',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './user-profile-card.component.html',
  styleUrl: './user-profile-card.component.css'
})
export class UserProfileCardComponent {
  @Input() user: GitHubUser | null = null;
  @Input() isLoading = false;
}
