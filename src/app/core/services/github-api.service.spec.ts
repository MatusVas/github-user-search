import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { GithubApiService } from './github-api.service';
import { GitHubUserResponse } from '../models/github-user.model';
import { setupLocalStorageMock } from '../../../test-setup';

describe('GithubApiService', () => {
  let service: GithubApiService;
  let httpMock: HttpTestingController;

  const mockApiResponse: GitHubUserResponse = {
    login: 'octocat',
    avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
    name: 'The Octocat',
    bio: 'GitHub mascot',
    location: 'San Francisco',
    blog: 'https://github.blog',
    twitter_username: 'github',
    company: '@github',
    public_repos: 8,
    followers: 3938,
    following: 9,
    created_at: '2011-01-25T18:44:36Z'
  };

  beforeEach(() => {
    setupLocalStorageMock();

    TestBed.configureTestingModule({
      providers: [
        GithubApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(GithubApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should transform GitHub API response correctly', () => {
    service.getUserByUsername('octocat').subscribe(user => {
      expect(user.username).toBe('octocat');
      expect(user.name).toBe('The Octocat');
      expect(user.avatarUrl).toBe('https://avatars.githubusercontent.com/u/583231?v=4');
      expect(user.bio).toBe('GitHub mascot');
      expect(user.location).toBe('San Francisco');
      expect(user.website).toBe('https://github.blog');
      expect(user.twitter).toBe('github');
      expect(user.company).toBe('@github');
      expect(user.repos).toBe(8);
      expect(user.followers).toBe(3938);
      expect(user.following).toBe(9);
      expect(user.joinedDate).toBe('Joined 25 Jan 2011');
    });

    const req = httpMock.expectOne('https://api.github.com/users/octocat');
    expect(req.request.method).toBe('GET');
    req.flush(mockApiResponse);
  });

  it('should handle empty blog field as null', () => {
    const responseWithEmptyBlog = { ...mockApiResponse, blog: '' };

    service.getUserByUsername('octocat').subscribe(user => {
      expect(user.website).toBeNull();
    });

    const req = httpMock.expectOne('https://api.github.com/users/octocat');
    req.flush(responseWithEmptyBlog);
  });

  it('should handle 404 errors with custom message', () => {
    service.getUserByUsername('nonexistentuser').subscribe({
      next: () => { throw new Error('should have failed with 404 error'); },
      error: (error) => {
        expect(error.message).toBe('No results');
      }
    });

    const req = httpMock.expectOne('https://api.github.com/users/nonexistentuser');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });

  it('should handle rate limit (403) errors', () => {
    service.getUserByUsername('octocat').subscribe({
      next: () => { throw new Error('should have failed with 403 error'); },
      error: (error) => {
        expect(error.message).toBe('Rate limit exceeded. Try again later.');
      }
    });

    const req = httpMock.expectOne('https://api.github.com/users/octocat');
    req.flush('Rate Limit Exceeded', { status: 403, statusText: 'Forbidden' });
  });

  it('should handle network errors', () => {
    service.getUserByUsername('octocat').subscribe({
      next: () => { throw new Error('should have failed with network error'); },
      error: (error) => {
        expect(error.message).toBe('Unable to connect to GitHub API');
      }
    });

    const req = httpMock.expectOne('https://api.github.com/users/octocat');
    req.error(new ProgressEvent('error'), { status: 0 });
  });
});
