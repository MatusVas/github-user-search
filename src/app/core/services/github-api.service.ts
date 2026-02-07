import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { GitHubUser, GitHubUserResponse } from '../models/github-user.model';

/**
 * Service for interacting with the GitHub API
 * Handles user data fetching, transformation, and error handling
 */
@Injectable({
  providedIn: 'root'
})
export class GithubApiService {
  private readonly API_BASE_URL = 'https://api.github.com';

  constructor(private http: HttpClient) {}

  /**
   * Fetches a GitHub user by username
   * @param username GitHub username to search for
   * @returns Observable<GitHubUser> with transformed user data
   */
  getUserByUsername(username: string): Observable<GitHubUser> {
    return this.http.get<GitHubUserResponse>(`${this.API_BASE_URL}/users/${username}`)
      .pipe(
        map(response => this.transformResponse(response)),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Transforms GitHub API response to application-friendly format
   */
  private transformResponse(raw: GitHubUserResponse): GitHubUser {
    return {
      username: raw.login,
      avatarUrl: raw.avatar_url,
      name: raw.name,
      bio: raw.bio,
      location: raw.location,
      website: raw.blog || null,
      twitter: raw.twitter_username,
      company: raw.company,
      repos: raw.public_repos,
      followers: raw.followers,
      following: raw.following,
      joinedDate: this.formatDate(raw.created_at)
    };
  }

  /**
   * Formats ISO 8601 date string to readable format
   * @param isoDate ISO 8601 date string (e.g., "2011-01-25T18:44:36Z")
   * @returns Formatted date string (e.g., "Joined 25 Jan 2011")
   */
  private formatDate(isoDate: string): string {
    try {
      const date = new Date(isoDate);
      const formatted = new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).format(date);
      return `Joined ${formatted}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  }

  /**
   * Handles HTTP errors and returns user-friendly error messages
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.status === 404) {
      errorMessage = 'No results';
    } else if (error.status === 403) {
      errorMessage = 'Rate limit exceeded. Try again later.';
    } else if (error.status === 0) {
      errorMessage = 'Unable to connect to GitHub API';
    } else {
      errorMessage = error.message || 'An error occurred';
    }

    return throwError(() => new Error(errorMessage));
  }
}
