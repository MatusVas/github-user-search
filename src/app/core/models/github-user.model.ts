/**
 * GitHub API response interface
 * Represents the raw data structure returned from GitHub's Users API
 */
export interface GitHubUserResponse {
  login: string;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  blog: string;
  twitter_username: string | null;
  company: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

/**
 * Application-friendly user model
 * Transformed from GitHubUserResponse with more descriptive property names
 */
export interface GitHubUser {
  username: string;
  avatarUrl: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  twitter: string | null;
  company: string | null;
  repos: number;
  followers: number;
  following: number;
  joinedDate: string;
}

/**
 * GitHub API authenticated user response interface
 * Represents the raw data structure returned from GitHub's /user endpoint
 */
export interface GitHubAuthUser {
  login: string;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
}

/**
 * GitHub API repository response interface
 * Represents the raw data structure returned from GitHub's repositories API
 */
export interface GitHubRepository {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
}

/**
 * Application-friendly authenticated user profile model
 * Transformed from GitHubAuthUser with more descriptive property names
 */
export interface UserProfile {
  username: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  publicRepos: number;
}

/**
 * Application-friendly repository model
 * Transformed from GitHubRepository with more descriptive property names
 */
export interface Repository {
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  stars: number;
  language: string | null;
  lastUpdated: string;
}
