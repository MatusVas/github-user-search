import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  GitHubUser,
  GitHubUserResponse,
  GitHubAuthUser,
  GitHubRepository,
  UserProfile,
  Repository
} from '../models/github-user.model';

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
   * Gets the authenticated user's profile
   * Requires valid access token via HTTP interceptor
   * @returns Observable<UserProfile> with transformed user data
   */
  getAuthenticatedUser(): Observable<UserProfile> {
    return this.http.get<GitHubAuthUser>(`${this.API_BASE_URL}/user`)
      .pipe(
        map(response => this.transformUserProfile(response)),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Gets the authenticated user's repositories
   * Requires valid access token via HTTP interceptor
   * @param sortBy Sort order ('updated' or 'created')
   * @param limit Maximum number of repositories to return
   * @returns Observable<Repository[]> with transformed repository data
   */
  getUserRepositories(sortBy: 'updated' | 'created' = 'updated', limit = 10): Observable<Repository[]> {
    return this.http.get<GitHubRepository[]>(
      `${this.API_BASE_URL}/user/repos?sort=${sortBy}&per_page=${limit}`
    ).pipe(
      map(repos => repos.map(repo => this.transformRepository(repo))),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Transforms authenticated user API response to application-friendly format
   */
  private transformUserProfile(raw: GitHubAuthUser): UserProfile {
    return {
      username: raw.login,
      name: raw.name,
      avatarUrl: raw.avatar_url,
      bio: raw.bio,
      publicRepos: raw.public_repos
    };
  }

  /**
   * Transforms repository API response to application-friendly format
   */
  private transformRepository(raw: GitHubRepository): Repository {
    return {
      name: raw.name,
      fullName: raw.full_name,
      description: raw.description,
      url: raw.html_url,
      stars: raw.stargazers_count,
      language: raw.language,
      lastUpdated: this.formatRepositoryDate(raw.updated_at)
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
   * Formats ISO 8601 date string for repository updates
   * @param isoDate ISO 8601 date string (e.g., "2023-01-25T18:44:36Z")
   * @returns Formatted date string (e.g., "25 Jan 2023")
   */
  private formatRepositoryDate(isoDate: string): string {
    try {
      const date = new Date(isoDate);
      return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).format(date);
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
