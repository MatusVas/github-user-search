import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DashboardComponent } from './dashboard.component';
import { GithubApiService } from '../../core/services/github-api.service';
import { Repository } from '../../core/models/github-user.model';
import { setupLocalStorageMock } from '../../../test-setup';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let httpMock: HttpTestingController;
  let githubApi: GithubApiService;

  const mockRepositories: Repository[] = [
    {
      name: 'test-repo',
      fullName: 'user/test-repo',
      description: 'Test repository',
      url: 'https://github.com/user/test-repo',
      stars: 10,
      language: 'TypeScript',
      lastUpdated: '1 Jan 2024'
    }
  ];

  beforeEach(() => {
    setupLocalStorageMock();

    TestBed.configureTestingModule({
      providers: [
        DashboardComponent,
        GithubApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    component = TestBed.inject(DashboardComponent);
    httpMock = TestBed.inject(HttpTestingController);
    githubApi = TestBed.inject(GithubApiService);
  });

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load repositories on init', () => {
    component.ngOnInit();

    expect(component.isLoading()).toBe(true);

    const req = httpMock.expectOne(
      (req) => req.url.includes('https://api.github.com/user/repos')
    );
    expect(req.request.method).toBe('GET');

    req.flush([
      {
        name: 'test-repo',
        full_name: 'user/test-repo',
        description: 'Test repository',
        html_url: 'https://github.com/user/test-repo',
        stargazers_count: 10,
        language: 'TypeScript',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ]);

    expect(component.isLoading()).toBe(false);
    expect(component.repositories().length).toBe(1);
    expect(component.repositories()[0].name).toBe('test-repo');
  });

  it('should handle error when loading repositories', () => {
    component.ngOnInit();

    const req = httpMock.expectOne(
      (req) => req.url.includes('https://api.github.com/user/repos')
    );
    req.flush('Error', { status: 500, statusText: 'Server Error' });

    expect(component.isLoading()).toBe(false);
    expect(component.error()).toBeTruthy();
  });

  it('should display empty state when no repositories', () => {
    component.ngOnInit();

    const req = httpMock.expectOne(
      (req) => req.url.includes('https://api.github.com/user/repos')
    );
    req.flush([]);

    expect(component.repositories().length).toBe(0);
    expect(component.isLoading()).toBe(false);
  });
});
