# PRP: GitHub User Search Feature

## Feature Summary
Implement a GitHub user search application with the following capabilities:
- Search GitHub users by username via API
- Display comprehensive user profile (avatar, bio, stats, links)
- Responsive design (mobile, tablet, desktop)
- Light/Dark mode toggle with persistence

## Context & Background

### Current Project State
**Framework**: Angular 21.1.3 with standalone components (no NgModule)
**State Management**: Angular Signals + RxJS Observables
**Test Framework**: Vitest (NOT Karma/Jasmine)
**Build Tool**: Angular Build (Vite-based)

**Existing Infrastructure**:
- ✅ Comprehensive CSS variable system in `src/styles.css`
- ✅ Typography presets (8 levels with utility classes)
- ✅ Spacing scale (0-1000)
- ✅ Color palette (neutral, blue accents, red error)
- ✅ Root component with RouterOutlet
- ❌ NO HttpClient configured
- ❌ NO services or API integration
- ❌ NO theme switching mechanism
- ❌ NO feature components

### API Endpoint
```
GET https://api.github.com/users/{username}
```

**Rate Limits**: 60 requests/hour for unauthenticated requests

### Design System References
**Figma Designs**:
- Light mode desktop: https://www.figma.com/design/CSKrPZ4ETBC5JY5zjRoTXn/github-user-search-app?node-id=1-705
- Dark mode desktop: https://www.figma.com/design/CSKrPZ4ETBC5JY5zjRoTXn/github-user-search-app?node-id=5-244
- Mobile design: https://www.figma.com/design/CSKrPZ4ETBC5JY5zjRoTXn/github-user-search-app?node-id=5-841
- Error state: https://www.figma.com/design/CSKrPZ4ETBC5JY5zjRoTXn/github-user-search-app?node-id=5-1522

**Key Visual Elements**:
- Font: Space Mono (already imported)
- Card-based layout with shadows
- Blue accent for primary actions (#0079ff)
- Stats in horizontal row (desktop) / vertical (mobile)
- Icons for location, website, twitter, company

---

## Implementation Blueprint

### Architecture Overview
```
App (Root)
└── UserSearchComponent (Smart Container)
    ├── HeaderComponent (Logo + Theme Toggle)
    │   └── IconComponent (sun/moon)
    ├── SearchBarComponent (Input + Button)
    │   └── IconComponent (search)
    └── UserProfileCardComponent (User Display)
        └── IconComponent (location, website, twitter, company)
```

**Pattern**: Smart/Presentational component separation
- **Smart**: UserSearchComponent (handles state, API calls)
- **Presentational**: All other components (receive data via inputs)

### State Management Strategy
- **Signals** for synchronous UI state (loading, theme, search query)
- **Observables** for asynchronous HTTP operations
- **localStorage** for theme persistence
- **No global state library** (not needed for this scope)

### Data Flow
```
User Input → SearchBar → UserSearchComponent
              ↓
         GitHubApiService
              ↓
      Observable<GitHubUser>
              ↓
    Update Signals (userData, loading, error)
              ↓
        Template Updates
```

---

## Critical Implementation Details

### 1. TypeScript Interfaces

**File**: `src/app/core/models/github-user.model.ts`

```typescript
// Raw API response (GitHub format)
export interface GitHubUserResponse {
  login: string;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  blog: string; // can be empty string
  twitter_username: string | null;
  company: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string; // ISO 8601: "2011-01-25T18:44:36Z"
}

// Application model (friendly names)
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
  joinedDate: string; // formatted: "Joined 25 Jan 2011"
}
```

### 2. HTTP Configuration

**File**: `src/app/app.config.ts`

```typescript
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch()) // ADD THIS
  ]
};
```

### 3. GitHub API Service

**File**: `src/app/core/services/github-api.service.ts`

**Key Methods**:
```typescript
getUserByUsername(username: string): Observable<GitHubUser>
```

**Error Handling**:
- **404**: User not found → emit error message "No results"
- **403**: Rate limit exceeded → emit "Rate limit exceeded. Try again later."
- **Network errors**: emit "Unable to connect to GitHub API"

**Response Transformation**:
```typescript
private transformResponse(raw: GitHubUserResponse): GitHubUser {
  return {
    username: raw.login,
    avatarUrl: raw.avatar_url,
    name: raw.name,
    bio: raw.bio,
    location: raw.location,
    website: raw.blog || null, // empty string becomes null
    twitter: raw.twitter_username,
    company: raw.company,
    repos: raw.public_repos,
    followers: raw.followers,
    following: raw.following,
    joinedDate: this.formatDate(raw.created_at)
  };
}

private formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return `Joined ${new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date)}`;
}
```

### 4. Theme Service

**File**: `src/app/core/services/theme.service.ts`

**Key Features**:
```typescript
@Injectable({ providedIn: 'root' })
export class ThemeService {
  theme = signal<'light' | 'dark'>('light');

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    // 1. Check localStorage
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
      this.setTheme(saved);
      return;
    }

    // 2. Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.setTheme(prefersDark ? 'dark' : 'light');
  }

  toggleTheme(): void {
    const newTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  private setTheme(theme: 'light' | 'dark'): void {
    this.theme.set(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
}
```

### 5. CSS Theme Variables

**File**: `src/styles.css` (ADD to existing content)

```css
/* Semantic color tokens (ADD THESE) */
:root {
  --bg-primary: var(--color-neutral-100);
  --bg-secondary: var(--color-neutral-0);
  --bg-input: var(--color-neutral-0);
  --text-primary: var(--color-neutral-700);
  --text-secondary: var(--color-neutral-500);
  --text-tertiary: var(--color-neutral-300);
  --shadow-card: 0px 16px 30px -10px rgba(70, 96, 187, 0.198);
}

[data-theme="dark"] {
  --bg-primary: var(--color-neutral-900);
  --bg-secondary: var(--color-neutral-800);
  --bg-input: var(--color-neutral-800);
  --text-primary: var(--color-neutral-0);
  --text-secondary: var(--color-neutral-0);
  --text-tertiary: var(--color-neutral-200);
  --shadow-card: none;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

### 6. Component Structure

#### A. HeaderComponent
**File**: `src/app/shared/components/header/header.component.ts`

**Template Structure**:
```html
<header>
  <h1>devfinder</h1>
  <button (click)="onThemeToggle()" aria-label="Toggle theme">
    <span>{{ themeLabel() }}</span>
    <app-icon [name]="themeIcon()" />
  </button>
</header>
```

**Computed Values**:
```typescript
themeLabel = computed(() => this.themeService.theme() === 'light' ? 'DARK' : 'LIGHT');
themeIcon = computed(() => this.themeService.theme() === 'light' ? 'moon' : 'sun');
```

#### B. SearchBarComponent
**File**: `src/app/shared/components/search-bar/search-bar.component.ts`

**Inputs/Outputs**:
```typescript
@Input() error: string | null = null;
@Output() search = new EventEmitter<string>();
```

**Template Structure**:
```html
<div class="search-container">
  <app-icon name="search" />
  <input
    type="text"
    [(ngModel)]="searchInput"
    (keyup.enter)="onSearch()"
    placeholder="Search GitHub username..."
    [attr.aria-invalid]="!!error"
  />
  @if (error) {
    <span class="error-text">{{ error }}</span>
  }
  <button (click)="onSearch()" [disabled]="!searchInput().trim()">
    Search
  </button>
</div>
```

**Validation Logic**:
```typescript
onSearch(): void {
  const trimmed = this.searchInput().trim();
  if (trimmed) {
    this.search.emit(trimmed);
  }
}
```

#### C. UserProfileCardComponent
**File**: `src/app/shared/components/user-profile-card/user-profile-card.component.ts`

**Inputs**:
```typescript
@Input() user: GitHubUser | null = null;
@Input() isLoading = false;
```

**Key Template Sections**:
1. Avatar (circular image)
2. User info (name, username, join date)
3. Bio text
4. Stats grid (repos, followers, following)
5. Links section (location, website, twitter, company)

**Unavailable Field Handling**:
```html
<div class="link-item" [class.unavailable]="!user.location">
  <app-icon name="location" />
  <span>{{ user.location || 'Not Available' }}</span>
</div>
```

```css
.link-item.unavailable {
  opacity: 0.5;
}
```

#### D. IconComponent
**File**: `src/app/shared/components/icon/icon.component.ts`

**Implementation**:
```typescript
@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    @switch (name) {
      @case ('search') { <svg><!-- search icon --></svg> }
      @case ('moon') { <svg><!-- moon icon --></svg> }
      @case ('sun') { <svg><!-- sun icon --></svg> }
      @case ('location') { <svg><!-- location icon --></svg> }
      @case ('website') { <svg><!-- website icon --></svg> }
      @case ('twitter') { <svg><!-- twitter icon --></svg> }
      @case ('company') { <svg><!-- company icon --></svg> }
    }
  `
})
export class IconComponent {
  @Input({ required: true }) name!: IconName;
}

type IconName = 'search' | 'moon' | 'sun' | 'location' | 'website' | 'twitter' | 'company';
```

**SVG Source**: Extract from Figma design system or use heroicons/feather icons

#### E. UserSearchComponent (Main Feature)
**File**: `src/app/features/user-search/user-search.component.ts`

**State Signals**:
```typescript
userData = signal<GitHubUser | null>(null);
isLoading = signal(false);
error = signal<string | null>(null);
```

**Search Handler**:
```typescript
onSearch(username: string): void {
  this.isLoading.set(true);
  this.error.set(null);
  this.userData.set(null);

  this.githubApi.getUserByUsername(username).subscribe({
    next: (user) => {
      this.userData.set(user);
      this.isLoading.set(false);
    },
    error: (err) => {
      this.error.set(err.message || 'An error occurred');
      this.isLoading.set(false);
    }
  });
}
```

**Template**:
```html
<div class="container">
  <app-header />
  <app-search-bar
    [error]="error()"
    (search)="onSearch($event)"
  />
  <app-user-profile-card
    [user]="userData()"
    [isLoading]="isLoading()"
  />
</div>
```

### 7. Routing Configuration

**File**: `src/app/app.routes.ts`

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/user-search/user-search.component')
        .then(m => m.UserSearchComponent)
  }
];
```

### 8. Responsive Design

**Breakpoints**:
- Mobile: ≤768px
- Tablet: 769px-1023px
- Desktop: ≥1024px

**Container Max-Width**: 730px

**Key Responsive Changes**:
```css
/* Desktop (default) */
.profile-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

/* Mobile */
@media (max-width: 768px) {
  .profile-stats {
    grid-template-columns: 1fr;
  }

  .user-info {
    flex-direction: column;
  }
}
```

---

## Implementation Checklist (Ordered)

### Phase 1: Foundation
- [ ] Create `src/app/core/models/github-user.model.ts` with interfaces
- [ ] Update `src/app/app.config.ts` to add `provideHttpClient(withFetch())`
- [ ] Create `src/app/core/services/github-api.service.ts` with API integration
- [ ] Create `src/app/core/services/theme.service.ts` with localStorage logic
- [ ] Update `src/styles.css` with theme variables and semantic tokens

### Phase 2: Basic Components
- [ ] Create `src/app/shared/components/icon/icon.component.ts` with inline SVGs
- [ ] Create `src/app/shared/components/header/header.component.ts` with theme toggle
- [ ] Create `src/app/shared/components/search-bar/search-bar.component.ts`

### Phase 3: Profile Display
- [ ] Create `src/app/shared/components/user-profile-card/user-profile-card.component.ts`
- [ ] Implement loading skeleton state
- [ ] Handle null/unavailable fields with opacity styling

### Phase 4: Integration
- [ ] Create `src/app/features/user-search/user-search.component.ts`
- [ ] Wire up all components with inputs/outputs
- [ ] Connect to GitHubApiService with error handling
- [ ] Update `src/app/app.routes.ts` with lazy-loaded route

### Phase 5: Polish
- [ ] Add hover states (`:hover`) for buttons and links
- [ ] Add focus states (`:focus-visible`) for accessibility
- [ ] Implement responsive breakpoints for mobile/tablet
- [ ] Test theme switching and persistence
- [ ] Clean up `src/app/app.html` (remove placeholder content)
- [ ] Initialize ThemeService in `src/app/app.ts` constructor

### Phase 6: Testing
- [ ] Write tests for GitHubApiService (API calls, error handling)
- [ ] Write tests for ThemeService (localStorage, toggle)
- [ ] Write component tests for SearchBar (validation, events)
- [ ] Write component tests for UserProfileCard (rendering, null handling)
- [ ] Integration test: full search flow

---

## Edge Cases & Error Handling

### 1. User Not Found (404)
**Trigger**: Search for non-existent username
**Expected**: Display "No results" error message in SearchBar
**Implementation**: Catch 404 in service, return custom error message

### 2. Rate Limit Exceeded (403)
**Trigger**: Exceed 60 requests/hour
**Expected**: Display "Rate limit exceeded. Try again later."
**Implementation**: Check response status code, provide helpful message

### 3. Network Error
**Trigger**: No internet connection or GitHub API down
**Expected**: Display "Unable to connect to GitHub API"
**Implementation**: Catch network errors in service

### 4. Null/Empty Fields
**Fields to Handle**: bio, location, website, twitter, company
**Expected**:
- Bio: Show "This profile has no bio"
- Others: Show "Not Available" with 50% opacity
**Implementation**: Template conditionals + CSS class `.unavailable`

### 5. Empty Blog Field
**Issue**: GitHub API returns empty string `""` instead of null
**Expected**: Treat as null
**Implementation**: `raw.blog || null` in transformation

### 6. Very Long Text
**Fields**: bio, company name
**Expected**: Truncate with ellipsis if exceeds container
**Implementation**:
```css
.bio-text {
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### 7. Theme Flash (FOUC)
**Issue**: Page loads with default theme before JavaScript runs
**Expected**: No visual flash when page loads
**Solution**: Initialize ThemeService in App constructor (app.ts)
```typescript
constructor(private themeService: ThemeService) {
  // Theme initializes immediately
}
```

### 8. Invalid/Whitespace Username
**Expected**: Disable search button, don't make API call
**Implementation**: Trim input, check for empty string before emitting search event

### 9. Avatar Load Failure
**Expected**: Show fallback or broken image indicator
**Implementation**:
```html
<img
  [src]="user.avatarUrl"
  [alt]="user.name || user.username"
  onerror="this.src='fallback-avatar.png'"
/>
```

### 10. Date Parsing Errors
**Expected**: Graceful fallback if date is invalid
**Implementation**: Try-catch around date formatting, return "Invalid date" on error

---

## Validation & Testing

### Automated Tests (Vitest)

**Run Command**:
```bash
npm test
```

**Test Files to Create**:
1. `src/app/core/services/github-api.service.spec.ts`
2. `src/app/core/services/theme.service.spec.ts`
3. `src/app/shared/components/search-bar/search-bar.component.spec.ts`
4. `src/app/shared/components/user-profile-card/user-profile-card.component.spec.ts`
5. `src/app/features/user-search/user-search.component.spec.ts`

**Key Test Scenarios**:

```typescript
// GitHubApiService
describe('GitHubApiService', () => {
  it('should transform GitHub API response correctly', () => { /* ... */ });
  it('should handle 404 errors with custom message', () => { /* ... */ });
  it('should handle rate limit (403) errors', () => { /* ... */ });
  it('should format join date correctly', () => { /* ... */ });
});

// ThemeService
describe('ThemeService', () => {
  it('should initialize from localStorage', () => { /* ... */ });
  it('should toggle between light and dark', () => { /* ... */ });
  it('should set data-theme attribute on document', () => { /* ... */ });
  it('should detect system preference when no saved theme', () => { /* ... */ });
});

// SearchBarComponent
describe('SearchBarComponent', () => {
  it('should emit search event with trimmed value', () => { /* ... */ });
  it('should not emit search for empty input', () => { /* ... */ });
  it('should display error message when error input is set', () => { /* ... */ });
  it('should trigger search on Enter key', () => { /* ... */ });
});

// UserProfileCardComponent
describe('UserProfileCardComponent', () => {
  it('should display user data correctly', () => { /* ... */ });
  it('should show "Not Available" for null fields', () => { /* ... */ });
  it('should apply opacity to unavailable links', () => { /* ... */ });
  it('should display loading skeleton when isLoading is true', () => { /* ... */ });
});
```

### Manual Testing Checklist

**Functional Testing**:
- [ ] Search for "octocat" → displays profile correctly
- [ ] Search for "thisuserdoesnotexist999" → shows "No results" error
- [ ] Search with empty input → button disabled or no action
- [ ] Search with whitespace only → no API call made
- [ ] Click theme toggle → switches light/dark mode
- [ ] Reload page → theme persists
- [ ] Check localStorage → contains theme value
- [ ] Test Enter key in search input → triggers search
- [ ] All links in profile are clickable (open in new tab)
- [ ] Null fields show "Not Available" with reduced opacity

**Visual Testing** (compare with Figma):
- [ ] Desktop layout matches Figma (1440px width)
- [ ] Tablet layout adapts correctly (768px-1023px)
- [ ] Mobile layout matches Figma (375px width)
- [ ] Light theme colors match design
- [ ] Dark theme colors match design
- [ ] Typography sizes match presets
- [ ] Spacing matches design tokens
- [ ] Card shadows appear in light mode
- [ ] Hover states work on button and links
- [ ] Focus states visible on all interactive elements

**Accessibility Testing**:
- [ ] Tab through all interactive elements (logical order)
- [ ] Focus indicators visible on keyboard navigation
- [ ] Theme toggle button has aria-label
- [ ] Search input has proper label/placeholder
- [ ] Error messages announced to screen readers
- [ ] Color contrast meets WCAG AA (4.5:1 minimum)
- [ ] Images have alt text
- [ ] Icon-only buttons have labels

**Browser Testing**:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Performance Validation

**Expected Metrics**:
- Initial bundle size: <500KB (per angular.json budget)
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Lighthouse Performance Score: >90

**Check Bundle Size**:
```bash
npm run build
# Check dist/ folder size
```

---

## Documentation & Best Practices

### Code Style Guidelines
- **TypeScript**: Use strict typing, no `any` types
- **Component Naming**: PascalCase with "Component" suffix
- **File Naming**: kebab-case (e.g., `github-api.service.ts`)
- **CSS Classes**: kebab-case, semantic names
- **Signals**: Use `signal()` for reactive state
- **Observables**: Use RxJS operators (map, catchError)

### Comments
- Add JSDoc for public methods in services
- Comment complex logic or non-obvious implementations
- No need for comments on self-explanatory code

### File Organization
```
src/app/
├── core/
│   ├── models/
│   │   └── github-user.model.ts
│   └── services/
│       ├── github-api.service.ts
│       └── theme.service.ts
├── features/
│   └── user-search/
│       ├── user-search.component.ts
│       ├── user-search.component.html
│       ├── user-search.component.css
│       └── user-search.component.spec.ts
└── shared/
    └── components/
        ├── header/
        ├── search-bar/
        ├── user-profile-card/
        └── icon/
```

---

## External Resources

### Angular Documentation
- **Signals**: https://angular.dev/guide/signals
- **HttpClient**: https://angular.dev/guide/http
- **Standalone Components**: https://angular.dev/guide/standalone-components
- **Testing**: https://angular.dev/guide/testing

### GitHub API Documentation
- **Users Endpoint**: https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28#get-a-user
- **Rate Limiting**: https://docs.github.com/en/rest/rate-limit

### Design System
- **Figma File**: https://www.figma.com/design/CSKrPZ4ETBC5JY5zjRoTXn/github-user-search-app
- **Icons**: Use Heroicons (https://heroicons.com) or Feather Icons (https://feathericons.com) for consistency

### Testing Resources
- **Vitest**: https://vitest.dev/
- **Testing Library**: https://testing-library.com/docs/angular-testing-library/intro (optional)

---

## Known Limitations & Future Enhancements

### Current Limitations
- No authentication (rate limit: 60 requests/hour)
- No repository list display (planned for OAuth phase)
- No search history or favorites
- No caching of API responses

### Future Enhancements (Out of Scope for v1)
- GitHub OAuth login for higher rate limits
- Dashboard route showing user's repositories
- Repository search functionality
- Pagination for large result sets
- Dark mode animation transitions
- Progressive Web App (PWA) capabilities

---

## Success Criteria

Implementation is complete when:
1. ✅ User can search any GitHub username
2. ✅ Profile displays all required fields (avatar, name, username, bio, stats, links)
3. ✅ Error handling works for 404, rate limit, and network errors
4. ✅ Theme toggle switches and persists preference
5. ✅ Responsive design works on mobile (≤768px), tablet, desktop
6. ✅ All interactive elements have hover and focus states
7. ✅ Loading indicator shows during API requests
8. ✅ "Not Available" displays for null fields with reduced opacity
9. ✅ All tests pass (`npm test`)
10. ✅ Visual design matches Figma screenshots
11. ✅ Accessibility audit passes (axe DevTools)
12. ✅ Bundle size under 500KB

---

## PRP Confidence Score: 9/10

**Rationale**:
- ✅ Comprehensive codebase analysis completed
- ✅ All patterns and conventions identified
- ✅ Clear architectural decisions documented
- ✅ Edge cases and error handling specified
- ✅ Testing strategy defined with executable commands
- ✅ External resources and documentation linked
- ✅ Implementation order prioritized
- ❌ Minor risk: Icon SVG implementation details (can be extracted from Figma during implementation)

**Expected Outcome**: One-pass implementation with minimal clarification questions. The agent has all context needed for component structure, styling patterns, error handling, and testing approach. The only potential blocker is obtaining the exact SVG markup for icons, which can be extracted from Figma designs during implementation.
