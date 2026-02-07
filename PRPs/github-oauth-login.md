# PRP: GitHub OAuth Login and Dashboard

## Overview

Implement GitHub OAuth authentication for the GitHub User Search application, enabling users to sign in with their GitHub account and access a protected dashboard displaying their repositories.

## Feature Requirements

Based on `INITIAL-auth-login.md` and `priloha-a-frontend.md`:

1. **Login Button**: "Sign in with GitHub" button
2. **OAuth Flow**: Complete GitHub OAuth 2.0 web application flow
3. **Session Management**: Login/logout functionality with token persistence
4. **User Display**: Show authenticated user's avatar and name in navbar/header with logout button
5. **Protected Dashboard**: Dashboard route accessible only when authenticated
6. **Repository List**: Display user's top 10 public repositories with:
   - Repository name (link to GitHub)
   - Description
   - Stars count
   - Primary language
   - Last updated date

## Technology Context

### Current Stack
- **Framework**: Angular 21.1.3 with standalone components
- **Testing**: Vitest (not Karma/Jasmine)
- **State Management**: Angular signals (`signal()`, `computed()`)
- **HTTP**: HttpClient with `provideHttpClient(withFetch())`
- **Routing**: Functional routing with lazy loading
- **Styling**: CSS custom properties in `src/styles.css`

### Existing Patterns (Reference These!)

#### Service Pattern
Reference: `src/app/core/services/github-api.service.ts:1-91`
```typescript
@Injectable({ providedIn: 'root' })
export class GithubApiService {
  private readonly API_BASE_URL = 'https://api.github.com';

  constructor(private http: HttpClient) {}

  // Uses RxJS operators: map, catchError
  // Returns typed Observables
  // Transforms API responses to app models
  // Handles errors with custom messages
}
```

#### Component Pattern
Reference: `src/app/features/user-search/user-search.component.ts:1-55`
```typescript
@Component({
  selector: 'app-user-search',
  standalone: true,
  imports: [HeaderComponent, SearchBarComponent, UserProfileCardComponent],
  templateUrl: './user-search.component.html',
  styleUrl: './user-search.component.css'
})
export class UserSearchComponent {
  // Use signals for state
  userData = signal<GitHubUser | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  constructor(private githubApi: GithubApiService) {}
}
```

#### Theme Service Pattern
Reference: `src/app/core/services/theme.service.ts:1-53`
```typescript
@Injectable({ providedIn: 'root' })
export class ThemeService {
  theme = signal<Theme>('light');

  constructor() {
    this.initializeTheme(); // Initialize in constructor
  }

  private initializeTheme(): void {
    // Check localStorage first
    const saved = localStorage.getItem('theme');
    if (saved) {
      this.setTheme(saved);
      return;
    }
    // Fall back to system preference
  }
}
```

#### Test Pattern
Reference: `src/app/core/services/github-api.service.spec.ts:1-114`
```typescript
describe('GithubApiService', () => {
  let service: GithubApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
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
  });
});
```

#### Routing Pattern
Reference: `src/app/app.routes.ts:1-11`
```typescript
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/user-search/user-search.component')
        .then(m => m.UserSearchComponent)
  }
];
```

#### Header Component Update
Reference: `src/app/shared/components/header/header.component.ts:1-26`
The header currently shows theme toggle. You'll need to add user info display when authenticated.

### Styling Guidelines
Reference: `src/styles.css:1-226`
- Use CSS custom properties: `--color-blue-500`, `--text-primary`, `--spacing-200`, etc.
- Typography presets: `.text-preset-1` through `.text-preset-8`
- Theme-aware: Use `--bg-primary`, `--bg-secondary` (switches in `[data-theme='dark']`)
- Responsive: Mobile breakpoint at `@media (max-width: 768px)`

## GitHub OAuth Implementation

### OAuth Flow Architecture

#### Web Application Flow
Documentation: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps

**Step 1**: Redirect to GitHub authorization
```
https://github.com/login/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:4200/auth/callback&scope=repo,user
```

**Step 2**: GitHub redirects back with code
```
http://localhost:4200/auth/callback?code=AUTHORIZATION_CODE
```

**Step 3**: Exchange code for access token (BACKEND REQUIRED)
```
POST https://github.com/login/oauth/access_token
Content-Type: application/json

{
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "code": "AUTHORIZATION_CODE"
}
```

**CRITICAL**: The token exchange MUST happen on a backend server because `client_secret` cannot be exposed in frontend code. This is a security requirement.

### OAuth App vs GitHub App
Reference: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/differences-between-github-apps-and-oauth-apps

**For this implementation, use OAuth Apps because:**
- Simpler for user authentication scenarios
- Acts on behalf of the user
- Suitable for dashboard applications

**Note**: GitHub Apps are better for integrations requiring fine-grained permissions, but add complexity not needed here.

### Required Scopes
- `user`: Access to authenticated user's profile
- `repo`: Access to public and private repositories

### GitHub API Endpoints

#### Get Authenticated User
```
GET https://api.github.com/user
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Returns:
```json
{
  "login": "octocat",
  "avatar_url": "https://avatars.githubusercontent.com/u/1?v=4",
  "name": "The Octocat",
  "bio": "GitHub mascot",
  "public_repos": 8,
  // ... more fields
}
```

#### Get User Repositories
Documentation: https://docs.github.com/en/rest/repos/repos

```
GET https://api.github.com/user/repos?sort=updated&per_page=10
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Returns array of repositories:
```json
[
  {
    "name": "Hello-World",
    "full_name": "octocat/Hello-World",
    "description": "My first repository",
    "html_url": "https://github.com/octocat/Hello-World",
    "stargazers_count": 80,
    "language": "JavaScript",
    "updated_at": "2023-01-01T12:00:00Z"
  }
]
```

## Implementation Plan

### Phase 1: Setup and Configuration

**Files to Create:**
1. `src/environments/environment.ts` - Environment configuration
2. `src/environments/environment.development.ts` - Development config

**Example structure:**
```typescript
export const environment = {
  production: false,
  github: {
    clientId: 'YOUR_GITHUB_CLIENT_ID',
    redirectUri: 'http://localhost:4200/auth/callback',
    scopes: ['user', 'repo']
  }
};
```

**IMPORTANT**: Add `src/environments/*.ts` to `.gitignore` and create `src/environments/environment.example.ts` with placeholder values for documentation.

### Phase 2: Authentication Service

**File to Create:** `src/app/core/services/auth.service.ts`

**Purpose**: Manage OAuth flow, token storage, and authentication state

**Pseudocode:**
```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  // State management with signals
  private accessToken = signal<string | null>(null);
  isAuthenticated = computed(() => this.accessToken() !== null);

  constructor(private http: HttpClient) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    // Check localStorage for existing token
    // Similar to ThemeService pattern
  }

  login(): void {
    // Build GitHub OAuth URL
    // Redirect to GitHub authorization
  }

  handleCallback(code: string): Observable<void> {
    // Exchange code for token via backend
    // Store token in localStorage
    // Update signal
  }

  logout(): void {
    // Clear token from localStorage
    // Reset signals
    // Redirect to home
  }

  getToken(): string | null {
    return this.accessToken();
  }
}
```

**Key Considerations:**
- Token storage: Use localStorage (key: `github_access_token`)
- Token format: Store as plain string
- Security: Never log tokens, clear on logout
- Error handling: Invalid tokens should trigger re-authentication

**Test File:** `src/app/core/services/auth.service.spec.ts`
- Test token persistence
- Test authentication state
- Test logout clears state
- Mock localStorage

### Phase 3: HTTP Interceptor

**File to Create:** `src/app/core/interceptors/auth.interceptor.ts`

**Purpose**: Automatically add Authorization header to GitHub API requests

**Functional Interceptor Pattern (Angular 21):**
```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Only add header for GitHub API requests
  if (token && req.url.includes('api.github.com')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
```

**Register in:** `src/app/app.config.ts`
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    )
  ]
};
```

### Phase 4: Auth Guard

**File to Create:** `src/app/core/guards/auth.guard.ts`

**Purpose**: Protect dashboard route from unauthenticated access

**Functional Guard Pattern:**
Documentation: https://angular.dev/guide/routing/route-guards

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect to home with return URL
  return router.createUrlTree(['/'], {
    queryParams: { returnUrl: state.url }
  });
};
```

**Apply to Route:** `src/app/app.routes.ts`
```typescript
{
  path: 'dashboard',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/dashboard/dashboard.component')
      .then(m => m.DashboardComponent)
}
```

**Test File:** `src/app/core/guards/auth.guard.spec.ts`
- Test allows authenticated users
- Test redirects unauthenticated users
- Test preserves return URL

### Phase 5: Models and API Extensions

**Files to Create/Update:**

1. **`src/app/core/models/github-user.model.ts`** (Update existing)
```typescript
// Add new interfaces
export interface GitHubAuthUser {
  login: string;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  // Matches GitHub /user endpoint response
}

export interface GitHubRepository {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
}

// Application models
export interface UserProfile {
  username: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  publicRepos: number;
}

export interface Repository {
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  stars: number;
  language: string | null;
  lastUpdated: string; // Formatted date
}
```

2. **`src/app/core/services/github-api.service.ts`** (Update existing)

Add methods:
```typescript
// Get authenticated user profile
getAuthenticatedUser(): Observable<UserProfile> {
  return this.http.get<GitHubAuthUser>(`${this.API_BASE_URL}/user`)
    .pipe(
      map(response => this.transformUserProfile(response)),
      catchError(error => this.handleError(error))
    );
}

// Get user repositories
getUserRepositories(sortBy: 'updated' | 'created' = 'updated', limit = 10): Observable<Repository[]> {
  return this.http.get<GitHubRepository[]>(
    `${this.API_BASE_URL}/user/repos?sort=${sortBy}&per_page=${limit}`
  ).pipe(
    map(repos => repos.map(repo => this.transformRepository(repo))),
    catchError(error => this.handleError(error))
  );
}

private transformUserProfile(raw: GitHubAuthUser): UserProfile {
  return {
    username: raw.login,
    name: raw.name,
    avatarUrl: raw.avatar_url,
    bio: raw.bio,
    publicRepos: raw.public_repos
  };
}

private transformRepository(raw: GitHubRepository): Repository {
  return {
    name: raw.name,
    fullName: raw.full_name,
    description: raw.description,
    url: raw.html_url,
    stars: raw.stargazers_count,
    language: raw.language,
    lastUpdated: this.formatDate(raw.updated_at)
  };
}
```

### Phase 6: Auth Callback Component

**File to Create:** `src/app/features/auth-callback/auth-callback.component.ts`

**Purpose**: Handle OAuth callback redirect from GitHub

**Component Logic:**
```typescript
@Component({
  selector: 'app-auth-callback',
  standalone: true,
  template: `
    <div class="callback-container">
      @if (isLoading()) {
        <p>Completing sign in...</p>
      }
      @if (error()) {
        <p class="error">{{ error() }}</p>
        <button (click)="retry()">Try Again</button>
      }
    </div>
  `,
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
    // Get 'code' from query params
    const code = this.route.snapshot.queryParams['code'];

    if (!code) {
      this.error.set('No authorization code received');
      this.isLoading.set(false);
      return;
    }

    // Exchange code for token
    this.authService.handleCallback(code).subscribe({
      next: () => {
        // Redirect to dashboard or return URL
        const returnUrl = this.route.snapshot.queryParams['state'] || '/dashboard';
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
```

**Route:** Add to `src/app/app.routes.ts`
```typescript
{
  path: 'auth/callback',
  loadComponent: () =>
    import('./features/auth-callback/auth-callback.component')
      .then(m => m.AuthCallbackComponent)
}
```

### Phase 7: Update Header Component

**File to Update:** `src/app/shared/components/header/header.component.ts`

**Add:**
```typescript
export class HeaderComponent {
  themeLabel = computed(() => this.themeService.theme() === 'light' ? 'DARK' : 'LIGHT');
  themeIcon = computed(() => this.themeService.theme() === 'light' ? 'moon' : 'sun');

  // NEW: Add auth state
  isAuthenticated = this.authService.isAuthenticated;
  userProfile = signal<UserProfile | null>(null);

  constructor(
    public themeService: ThemeService,
    private authService: AuthService,
    private githubApi: GithubApiService
  ) {
    // Load user profile when authenticated
    effect(() => {
      if (this.isAuthenticated()) {
        this.loadUserProfile();
      } else {
        this.userProfile.set(null);
      }
    });
  }

  private loadUserProfile(): void {
    this.githubApi.getAuthenticatedUser().subscribe({
      next: (profile) => this.userProfile.set(profile),
      error: (err) => console.error('Failed to load user profile:', err)
    });
  }

  onLogin(): void {
    this.authService.login();
  }

  onLogout(): void {
    this.authService.logout();
  }

  onThemeToggle(): void {
    this.themeService.toggleTheme();
  }
}
```

**Template Update:** `src/app/shared/components/header/header.component.html`
```html
<header class="header">
  <h1 class="logo text-preset-1">devfinder</h1>

  <div class="header-actions">
    <!-- Theme toggle -->
    <button
      class="theme-toggle"
      (click)="onThemeToggle()"
      [attr.aria-label]="'Toggle ' + themeLabel() + ' mode'"
    >
      <span class="theme-label text-preset-8">{{ themeLabel() }}</span>
      <app-icon [name]="themeIcon()" />
    </button>

    <!-- Auth controls -->
    @if (!isAuthenticated()) {
      <button class="btn-login" (click)="onLogin()">
        Sign in with GitHub
      </button>
    } @else if (userProfile()) {
      <div class="user-info">
        <img
          [src]="userProfile()!.avatarUrl"
          [alt]="userProfile()!.username"
          class="user-avatar"
        >
        <span class="user-name text-preset-6">{{ userProfile()!.name || userProfile()!.username }}</span>
        <button class="btn-logout" (click)="onLogout()">
          Logout
        </button>
      </div>
    }
  </div>
</header>
```

**Styling:** Use existing CSS custom properties for consistency

### Phase 8: Dashboard Component

**File to Create:** `src/app/features/dashboard/dashboard.component.ts`

**Purpose**: Display user's repositories

**Component:**
```typescript
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent /* Add repo card component */],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  repositories = signal<Repository[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  constructor(private githubApi: GithubApiService) {}

  ngOnInit(): void {
    this.loadRepositories();
  }

  private loadRepositories(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.githubApi.getUserRepositories('updated', 10).subscribe({
      next: (repos) => {
        this.repositories.set(repos);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load repositories');
        this.isLoading.set(false);
      }
    });
  }
}
```

**Template:**
```html
<div class="dashboard">
  <app-header />

  <main class="dashboard-content">
    <h2 class="text-preset-2">Your Repositories</h2>

    @if (isLoading()) {
      <div class="loading">Loading repositories...</div>
    } @else if (error()) {
      <div class="error">{{ error() }}</div>
    } @else if (repositories().length === 0) {
      <p>No repositories found</p>
    } @else {
      <div class="repo-grid">
        @for (repo of repositories(); track repo.fullName) {
          <article class="repo-card">
            <h3 class="text-preset-4">
              <a [href]="repo.url" target="_blank" rel="noopener">
                {{ repo.name }}
              </a>
            </h3>
            @if (repo.description) {
              <p class="repo-description text-preset-6">{{ repo.description }}</p>
            }
            <div class="repo-meta">
              @if (repo.language) {
                <span class="repo-language text-preset-7">{{ repo.language }}</span>
              }
              <span class="repo-stars text-preset-7">
                ⭐ {{ repo.stars }}
              </span>
              <span class="repo-updated text-preset-7">
                Updated {{ repo.lastUpdated }}
              </span>
            </div>
          </article>
        }
      </div>
    }
  </main>
</div>
```

### Phase 9: Backend Proxy (CRITICAL)

**SECURITY REQUIREMENT**: The OAuth token exchange requires `client_secret`, which MUST NOT be exposed in frontend code.

**Options:**

#### Option A: Simple Node.js Proxy Server (Recommended for Development)

Create `server/proxy.js`:
```javascript
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

app.post('/api/auth/github/token', async (req, res) => {
  const { code } = req.body;

  try {
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code
      },
      {
        headers: { Accept: 'application/json' }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Token exchange failed' });
  }
});

app.listen(3000, () => {
  console.log('Proxy server running on http://localhost:3000');
});
```

**Run:** `node server/proxy.js`

**Update AuthService to use proxy:**
```typescript
handleCallback(code: string): Observable<void> {
  return this.http.post<{ access_token: string }>(
    'http://localhost:3000/api/auth/github/token',
    { code }
  ).pipe(
    map(response => {
      this.setToken(response.access_token);
    }),
    catchError(error => {
      console.error('Token exchange failed:', error);
      return throwError(() => new Error('Authentication failed'));
    })
  );
}
```

#### Option B: Angular Proxy Configuration (Development Only)

Create `proxy.conf.json`:
```json
{
  "/api/auth/github": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true
  }
}
```

Update `angular.json`:
```json
"serve": {
  "builder": "@angular/build:dev-server",
  "options": {
    "proxyConfig": "proxy.conf.json"
  }
}
```

**PRODUCTION**: Use a proper backend service (Node.js, Python Flask, etc.) deployed separately.

### Phase 10: Update Routes

**File to Update:** `src/app/app.routes.ts`

**Complete routing configuration:**
```typescript
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/user-search/user-search.component')
        .then(m => m.UserSearchComponent)
  },
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./features/auth-callback/auth-callback.component')
        .then(m => m.AuthCallbackComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
```

## Testing Strategy

### Unit Tests (Vitest)

**Test Files to Create:**
1. `src/app/core/services/auth.service.spec.ts`
2. `src/app/core/guards/auth.guard.spec.ts`
3. `src/app/features/auth-callback/auth-callback.component.spec.ts`
4. `src/app/features/dashboard/dashboard.component.spec.ts`

**Update Existing:**
1. `src/app/core/services/github-api.service.spec.ts` - Add tests for new methods
2. `src/app/shared/components/header/header.component.spec.ts` - Add auth tests

**Testing Patterns:**

```typescript
// Mock localStorage
beforeEach(() => {
  const mockStorage: { [key: string]: string } = {};
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => mockStorage[key] || null);
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
    mockStorage[key] = value;
  });
  vi.spyOn(Storage.prototype, 'removeItem').mockImplementation((key) => {
    delete mockStorage[key];
  });
});

// Mock HTTP requests
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      AuthService,
      provideHttpClient(),
      provideHttpClientTesting()
    ]
  });
  httpMock = TestBed.inject(HttpTestingController);
});
```

### Integration Tests

**Manual Testing Checklist:**
1. ✅ Login button redirects to GitHub
2. ✅ GitHub callback redirects back to app
3. ✅ Token is stored in localStorage
4. ✅ User info appears in header
5. ✅ Dashboard loads repositories
6. ✅ Logout clears token and redirects
7. ✅ Unauthenticated users redirected from /dashboard
8. ✅ Theme toggle still works when authenticated
9. ✅ Token persists on page refresh
10. ✅ Invalid tokens trigger re-authentication

## Common Pitfalls and Solutions

### 1. CORS Issues
**Problem**: GitHub OAuth token exchange fails due to CORS
**Solution**: MUST use backend proxy (see Phase 9)

### 2. Redirect URI Mismatch
**Problem**: GitHub shows "redirect_uri_mismatch" error
**Solution**: Ensure callback URL in GitHub OAuth app settings exactly matches `environment.github.redirectUri`

### 3. Token Not Included in Requests
**Problem**: API returns 401 Unauthorized
**Solution**: Verify HTTP interceptor is registered in `app.config.ts` and checks for `api.github.com` URLs

### 4. Rate Limiting
**Problem**: GitHub API returns 403 rate limit error
**Solution**: Authenticated requests have higher limits (5000/hour vs 60/hour). Ensure token is being sent.

### 5. State Parameter for Security
**Problem**: OAuth state parameter not validated
**Solution**: Generate random state in login(), store in sessionStorage, validate in callback

### 6. Token Expiration
**Problem**: GitHub OAuth tokens don't expire, but can be revoked
**Solution**: Handle 401 responses by clearing token and redirecting to login

## Documentation and Resources

### Official Documentation
- GitHub OAuth Apps: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
- GitHub REST API - Users: https://docs.github.com/en/rest/users/users
- GitHub REST API - Repositories: https://docs.github.com/en/rest/repos/repos
- Angular Route Guards: https://angular.dev/guide/routing/route-guards
- Angular HTTP Interceptors: https://angular.dev/guide/http/interceptors

### Library References (Optional - Not Required for Basic Implementation)
- angular-oauth2-oidc: https://www.npmjs.com/package/angular-oauth2-oidc
- angular-auth-oidc-client: https://www.npmjs.com/package/angular-auth-oidc-client

**Note**: These libraries are overkill for simple GitHub OAuth. Implement manually for learning and control.

### Related Reading
- OAuth 2.0 Simplified: https://www.oauth.com/
- Auth0 GitHub Authentication Guide: https://developer.auth0.com/resources/labs/authentication/authenticate-using-github

## Implementation Task Checklist

Execute tasks in this order for smooth implementation:

### Setup (Tasks 1-3)
- [ ] 1. Create environment configuration files with GitHub OAuth settings
- [ ] 2. Add environment files to .gitignore
- [ ] 3. Register GitHub OAuth App at https://github.com/settings/developers

### Core Services (Tasks 4-7)
- [ ] 4. Create AuthService with token management and OAuth flow
- [ ] 5. Create auth HTTP interceptor for automatic token injection
- [ ] 6. Create auth guard for route protection
- [ ] 7. Write unit tests for AuthService and auth guard

### Models and API (Tasks 8-9)
- [ ] 8. Update github-user.model.ts with new interfaces
- [ ] 9. Extend GithubApiService with authenticated user and repo methods

### Components (Tasks 10-13)
- [ ] 10. Create AuthCallbackComponent for OAuth redirect handling
- [ ] 11. Update HeaderComponent with user info and login/logout buttons
- [ ] 12. Create DashboardComponent with repository list
- [ ] 13. Write component tests

### Backend Proxy (Tasks 14-15)
- [ ] 14. Create Node.js proxy server for token exchange
- [ ] 15. Configure environment variables for GitHub credentials

### Routing (Task 16)
- [ ] 16. Update app.routes.ts with dashboard route and auth guard

### Integration (Tasks 17-18)
- [ ] 17. Register HTTP interceptor in app.config.ts
- [ ] 18. Manual end-to-end testing

### Styling (Task 19)
- [ ] 19. Style all new components using existing CSS custom properties

## Validation Gates

Execute these commands to validate implementation success:

```bash
# 1. Install dependencies (if new packages added)
npm install

# 2. Type checking
npx tsc --noEmit

# 3. Run all unit tests
npm test

# 4. Build for production (should complete without errors)
npm run build

# 5. Start dev server (should run without console errors)
npm start

# 6. Start proxy server (in separate terminal)
cd server && node proxy.js
```

**Manual Validation:**
1. Navigate to http://localhost:4200
2. Click "Sign in with GitHub"
3. Authorize on GitHub
4. Verify redirect to dashboard
5. Verify repositories load
6. Verify user info in header
7. Click logout
8. Verify redirect to home
9. Try accessing /dashboard directly (should redirect to home)
10. Log in again (token should persist on refresh)

## Success Criteria

Implementation is complete when:

1. ✅ All unit tests pass (`npm test`)
2. ✅ TypeScript compilation succeeds with no errors
3. ✅ User can log in via GitHub OAuth
4. ✅ Dashboard displays top 10 repositories
5. ✅ User info appears in header when authenticated
6. ✅ Logout clears authentication state
7. ✅ Protected routes redirect unauthenticated users
8. ✅ Theme toggle works with authentication
9. ✅ No tokens or secrets exposed in frontend code
10. ✅ Token persists across page refreshes

## PRP Quality Score

**Confidence Level for One-Pass Implementation: 8/10**

**Rationale:**
- ✅ Comprehensive context with existing code patterns
- ✅ Detailed pseudocode and examples
- ✅ Clear validation gates
- ✅ Common pitfalls documented
- ✅ Step-by-step task checklist
- ⚠️  Backend proxy setup requires external knowledge
- ⚠️  GitHub OAuth app registration is external dependency

**What Could Go Wrong:**
1. Backend proxy configuration complexity
2. GitHub OAuth app registration issues
3. Environment variable management confusion

**Mitigations Provided:**
1. Multiple proxy implementation options with code examples
2. Callback URL documentation and troubleshooting
3. Environment configuration examples and .gitignore guidance
