import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';

/**
 * Service for managing GitHub OAuth authentication
 * Handles OAuth flow, token storage, and authentication state
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'github_access_token';
  private readonly STATE_KEY = 'github_oauth_state';

  private accessToken = signal<string | null>(null);
  isAuthenticated = computed(() => this.accessToken() !== null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuth();
  }

  /**
   * Initializes authentication by checking localStorage for existing token
   * Similar to ThemeService pattern
   */
  private initializeAuth(): void {
    const saved = localStorage.getItem(this.TOKEN_KEY);
    if (saved) {
      this.accessToken.set(saved);
    }
  }

  /**
   * Initiates GitHub OAuth login flow
   * Redirects user to GitHub authorization page
   */
  login(): void {
    // Generate random state for CSRF protection
    const state = this.generateRandomState();
    sessionStorage.setItem(this.STATE_KEY, state);

    // Build GitHub OAuth URL
    const params = new URLSearchParams({
      client_id: environment.github.clientId,
      redirect_uri: environment.github.redirectUri,
      scope: environment.github.scopes.join(' '),
      state: state
    });

    const authUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
    window.location.href = authUrl;
  }

  /**
   * Handles OAuth callback from GitHub
   * Exchanges authorization code for access token
   * @param code Authorization code from GitHub
   * @returns Observable<void>
   */
  handleCallback(code: string): Observable<void> {
    return this.http.post<{ access_token: string }>(
      environment.proxyUrl,
      { code }
    ).pipe(
      map(response => {
        if (response.access_token) {
          this.setToken(response.access_token);
        } else {
          throw new Error('No access token received');
        }
      }),
      catchError(error => {
        console.error('Token exchange failed:', error);
        return throwError(() => new Error('Authentication failed'));
      })
    );
  }

  /**
   * Logs out the user
   * Clears token from localStorage and redirects to home
   */
  logout(): void {
    this.clearToken();
    this.router.navigate(['/']);
  }

  /**
   * Gets the current access token
   * @returns Access token or null if not authenticated
   */
  getToken(): string | null {
    return this.accessToken();
  }

  /**
   * Sets the access token and persists to localStorage
   * @param token Access token from GitHub
   */
  private setToken(token: string): void {
    this.accessToken.set(token);
    localStorage.setItem(this.TOKEN_KEY, token);
    sessionStorage.removeItem(this.STATE_KEY);
  }

  /**
   * Clears the access token from memory and localStorage
   */
  private clearToken(): void {
    this.accessToken.set(null);
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.STATE_KEY);
  }

  /**
   * Generates a random state string for CSRF protection
   * @returns Random state string
   */
  private generateRandomState(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Validates the OAuth state parameter
   * @param state State parameter from OAuth callback
   * @returns True if state is valid
   */
  validateState(state: string): boolean {
    const savedState = sessionStorage.getItem(this.STATE_KEY);
    return savedState === state;
  }
}
