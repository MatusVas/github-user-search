# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GitHub Dashboard application built with Angular 21.1.3. The project has two main features:
1. **Public Search**: Search GitHub users by username and display their public profile
2. **GitHub OAuth Login**: Authenticated dashboard showing user's repositories

## Development Commands

### Setup
```bash
npm install
```

### Development Server
```bash
npm start
# or
ng serve
```
Runs at http://localhost:4200/ with hot reload

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
ng test
```

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

### Project Structure
- `src/app/app.ts` - Root component using standalone API
- `src/app/app.config.ts` - Application configuration with providers
- `src/app/app.routes.ts` - Route definitions
- `src/main.ts` - Application bootstrap
- `public/` - Static assets

### Key Configuration
- **TypeScript**: Strict mode enabled with Angular-specific compiler options
- **Component Prefix**: `app` (defined in angular.json)
- **Prettier**: Configured with 100 character print width, single quotes, Angular HTML parser

### Angular-Specific Notes
- Uses **standalone components** (no NgModule)
- Uses Angular **signals** for reactivity (see `signal()` in app.ts)
- Routes configured via `provideRouter()` in app.config.ts
- Global error listeners enabled via `provideBrowserGlobalErrorListeners()`

## API Integration

### GitHub API Endpoints
```
GET https://api.github.com/users/{username}
```

### OAuth Flow
The application needs to implement GitHub OAuth authentication to access:
- User's avatar and profile info
- Top 10 public repositories with:
  - Name (link to GitHub)
  - Description
  - Stars count
  - Primary language
  - Last updated date

## UI Requirements

Based on `priloha-a-frontend.md`:
- Responsive design (mobile + desktop)
- Light/Dark mode toggle
- Protected dashboard route (requires authentication)
- Login/logout functionality with session management
- User display in navbar when authenticated
