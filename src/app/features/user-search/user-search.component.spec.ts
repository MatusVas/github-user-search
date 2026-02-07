import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserSearchComponent } from './user-search.component';
import { GitHubUserResponse } from '../../core/models/github-user.model';

describe('UserSearchComponent', () => {
  let component: UserSearchComponent;
  let fixture: ComponentFixture<UserSearchComponent>;
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSearchComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserSearchComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set loading to true when search starts', () => {
    expect(component.isLoading()).toBe(false);

    component.onSearch('octocat');

    expect(component.isLoading()).toBe(true);

    const req = httpMock.expectOne('https://api.github.com/users/octocat');
    req.flush(mockApiResponse);
  });

  it('should update userData signal on successful search', () => {
    component.onSearch('octocat');

    const req = httpMock.expectOne('https://api.github.com/users/octocat');
    req.flush(mockApiResponse);

    expect(component.userData()).toBeTruthy();
    expect(component.userData()?.username).toBe('octocat');
    expect(component.isLoading()).toBe(false);
    expect(component.error()).toBeNull();
  });

  it('should update error signal on failed search', () => {
    component.onSearch('nonexistentuser');

    const req = httpMock.expectOne('https://api.github.com/users/nonexistentuser');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });

    expect(component.error()).toBe('No results');
    expect(component.userData()).toBeNull();
    expect(component.isLoading()).toBe(false);
  });

  it('should clear previous data when new search starts', () => {
    // First search
    component.onSearch('octocat');
    const req1 = httpMock.expectOne('https://api.github.com/users/octocat');
    req1.flush(mockApiResponse);

    expect(component.userData()).toBeTruthy();

    // Second search
    component.onSearch('anotheruser');

    expect(component.userData()).toBeNull();
    expect(component.error()).toBeNull();

    const req2 = httpMock.expectOne('https://api.github.com/users/anotheruser');
    req2.flush(mockApiResponse);
  });
});
