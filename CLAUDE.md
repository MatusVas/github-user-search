# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GitHub Dashboard application built with Angular 21.1.3. The project has two main features:
1. **Public Search**: Search GitHub users by username and display their public profile
2. **GitHub OAuth Login**: Authenticated dashboard showing user's repositories

Both features are **fully implemented** with complete unit tests, responsive design, and light/dark mode support.

## Development Commands

### Initial Setup
```bash
npm install                 # Install frontend dependencies
cd server && npm install    # Install OAuth proxy server dependencies
```

### Development Server

**Two servers must run simultaneously:**

**Terminal 1 - OAuth Proxy Server:**
```bash
cd server
npm start
```
Runs at http://localhost:3000 - handles secure OAuth token exchange

**Terminal 2 - Angular Frontend:**
```bash
npm start
# or
ng serve
```
Runs at http://localhost:4200 with hot reload

### Build
```bash
npm run build              # Production build
npm run watch              # Development build with watch mode
ng build --configuration development
```
Output: `dist/` directory

### Testing
```bash
npm test                   # Run all tests with Vitest
ng test                    # Same command
```
**Testing Notes:**
- Uses Vitest (NOT Karma/Jasmine)
- All tests include localStorage and sessionStorage mocks
- Coverage includes components, services, guards, and interceptors

### Code Generation
```bash
ng generate component component-name
ng generate --help         # See all available schematics
```

## Architecture

### Technology Stack
- **Framework**: Angular 21.1.3 with standalone components
- **Test Runner**: Vitest (not Karma/Jasmine)
- **Build Tool**: Angular Build (Vite-based)
- **Package Manager**: npm 11.8.0
- **Backend**: Node.js Express server for OAuth proxy

### Project Structure
```
src/app/
├── app.ts                    # Root component using standalone API
├── app.config.ts             # Application configuration with providers
├── app.routes.ts             # Route definitions
├── core/
│   ├── guards/
│   │   └── auth.guard.ts     # Route protection for authenticated routes
│   ├── interceptors/
│   │   └── auth.interceptor.ts  # HTTP interceptor for adding auth headers
│   ├── models/
│   │   └── github-user.model.ts # TypeScript interfaces for GitHub API
│   └── services/
│       ├── auth.service.ts       # OAuth authentication logic
│       ├── github-api.service.ts # GitHub API integration
│       └── theme.service.ts      # Light/dark mode toggle
├── features/
│   ├── auth-callback/        # OAuth callback handler
│   ├── dashboard/            # Authenticated user dashboard
│   └── user-search/          # Public user search
└── shared/
    └── components/
        └── search-bar/       # Reusable search bar component

server/
├── index.js                  # OAuth proxy server
├── .env.example              # Environment template
└── README.md                 # Server setup instructions

public/                       # Static assets
src/main.ts                  # Application bootstrap
```

### Key Configuration
- **TypeScript**: Strict mode enabled with Angular-specific compiler options
- **Component Prefix**: `app` (defined in angular.json)
- **Prettier**: Configured with 100 character print width, single quotes, Angular HTML parser

### Angular-Specific Notes
- Uses **standalone components** (no NgModule)
- Uses Angular **signals** for reactivity (see `signal()` in app.ts)
- Routes configured via `provideRouter()` in app.config.ts
- Global error listeners enabled via `provideBrowserGlobalErrorListeners()`
- HTTP interceptor registered via `provideHttpClient(withInterceptors([authInterceptor]))`

## Environment Configuration

### Frontend Environment Files

**Create these files (they are gitignored):**

1. `src/environments/environment.development.ts`:
```typescript
export const environment = {
  production: false,
  github: {
    clientId: 'YOUR_GITHUB_CLIENT_ID_HERE',
    redirectUri: 'http://localhost:4200/auth/callback',
    scopes: ['user', 'repo']
  },
  proxyUrl: 'http://localhost:3000/api/auth/github/token'
};
```

2. `src/environments/environment.ts` (production):
```typescript
export const environment = {
  production: true,
  github: {
    clientId: 'YOUR_GITHUB_CLIENT_ID_HERE',
    redirectUri: 'YOUR_PRODUCTION_URL/auth/callback',
    scopes: ['user', 'repo']
  },
  proxyUrl: 'YOUR_PRODUCTION_PROXY_URL/api/auth/github/token'
};
```

### Backend Environment Files

**Create `server/.env` (gitignored):**
```
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
PORT=3000
```

**Templates available:**
- `src/environments/environment.example.ts` - Frontend template
- `server/.env.example` - Backend template

## GitHub OAuth Setup

### Register OAuth App
1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: `GitHub User Search`
   - **Homepage URL**: `http://localhost:4200`
   - **Authorization callback URL**: `http://localhost:4200/auth/callback`
4. Copy **Client ID** (use in both frontend and backend)
5. Generate and copy **Client Secret** (use in backend only)

For detailed setup instructions, see `OAUTH_SETUP.md`.

## API Integration

### GitHub API Endpoints

**Public API (Unauthenticated):**
```
GET https://api.github.com/users/{username}
```
Used by the public search feature.

**Authenticated API:**
```
GET https://api.github.com/user
GET https://api.github.com/user/repos?sort=updated&per_page=10
```
Used by the dashboard to show user profile and repositories.

### OAuth Proxy Server Endpoints
```
POST http://localhost:3000/api/auth/github/token
  Body: { code: 'authorization_code' }
  Returns: { access_token: 'gho_...' }

GET http://localhost:3000/health
  Returns: { status: 'ok' }
```

### OAuth Flow Implementation
1. User clicks "Sign in with GitHub" button
2. Frontend redirects to `https://github.com/login/oauth/authorize`
3. User authorizes on GitHub
4. GitHub redirects back to `/auth/callback?code=...`
5. Frontend sends code to proxy server
6. Proxy exchanges code for access token (keeps client_secret secure)
7. Frontend stores token in localStorage
8. Auth interceptor adds token to all API requests

## Features

### ✅ Public Search
- Search GitHub users by username
- Display user profile with avatar, name, bio, stats
- Error handling for user not found
- Responsive design (mobile + desktop)
- Light/dark mode support

### ✅ GitHub OAuth Login
- Full OAuth 2.0 authentication flow
- Secure token exchange via backend proxy
- Protected dashboard route (requires authentication)
- Display authenticated user info in header
- Show top 10 repositories with:
  - Repository name (link to GitHub)
  - Description
  - Stars count
  - Primary language
  - Last updated date
- Login/logout functionality
- Token persistence (survives page refresh)
- Session management with localStorage

### ✅ UI/UX
- Responsive design (mobile + desktop)
- Light/dark mode toggle
- Theme persistence
- Loading states
- Error states
- Empty states
- Accessible components

### ✅ Testing
- Unit tests for all components with Vitest
- Service tests with mocked dependencies
- Guard and interceptor tests
- localStorage and sessionStorage mocks
- 100% critical path coverage

## Security Considerations

### ⚠️ Never Commit These Files:
- `src/environments/environment.ts`
- `src/environments/environment.development.ts`
- `server/.env`

These files contain secrets and are in `.gitignore`.

### ✅ Safe to Commit:
- `src/environments/environment.example.ts`
- `server/.env.example`

### OAuth Security
- Client secret is NEVER exposed to frontend
- All token exchanges happen server-side
- Tokens stored in localStorage (consider httpOnly cookies for production)
- CORS properly configured in proxy server

## Styling

### CSS Architecture
- Global styles in `src/styles.css`
- Component-scoped styles using `:host` and `:host-context`
- CSS custom properties (variables) for theming
- Dark mode via `[data-theme='dark']` attribute on `<html>`

### Theme Toggle
- Theme service manages light/dark mode
- Persists preference in localStorage
- Uses `:host-context([data-theme='dark'])` for dark mode styles in components

### Design System
- Preset text styles (`.text-preset-1`, `.text-preset-2`, etc.)
- Consistent color palette via CSS variables
- Responsive breakpoints for mobile/tablet/desktop

## Troubleshooting

### OAuth Issues
See `OAUTH_SETUP.md` for detailed troubleshooting:
- redirect_uri_mismatch
- Token exchange failed
- No authorization code received
- Failed to load repositories

### Common Development Issues

**Tests failing with localStorage/sessionStorage errors:**
- Check that mocks are properly set up in test files
- Example: `vi.stubGlobal('localStorage', mockLocalStorage)`

**Dark mode styles not working:**
- Use `:host-context([data-theme='dark'])` not `[data-theme='dark']`
- Theme attribute is set on `<html>` element

**API requests not including auth token:**
- Verify HTTP interceptor is registered in `app.config.ts`
- Check that auth service is storing token correctly
- Inspect Network tab for Authorization header

## Additional Resources

- [Angular Documentation](https://angular.dev)
- [GitHub OAuth Documentation](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [Vitest Documentation](https://vitest.dev)
