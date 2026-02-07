import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

/**
 * Auth callback component for handling OAuth redirect from GitHub
 * Extracts authorization code from URL and exchanges it for access token
 */
@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [],
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.css'
})
export class AuthCallbackComponent implements OnInit {
  isLoading = signal(true);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const code = this.route.snapshot.queryParams['code'];
    const state = this.route.snapshot.queryParams['state'];

    if (!code) {
      this.error.set('No authorization code received');
      this.isLoading.set(false);
      return;
    }

    // Validate state for CSRF protection
    if (state && !this.authService.validateState(state)) {
      this.error.set('Invalid state parameter. Possible CSRF attack.');
      this.isLoading.set(false);
      return;
    }

    // Exchange code for token
    this.authService.handleCallback(code).subscribe({
      next: () => {
        // Redirect to dashboard or return URL
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigate([returnUrl]);
      },
      error: (err) => {
        this.error.set(err.message || 'Authentication failed');
        this.isLoading.set(false);
      }
    });
  }

  retry(): void {
    this.authService.login();
  }
}
