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
