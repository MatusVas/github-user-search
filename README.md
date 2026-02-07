# GitHub User Search

A modern Angular 21 application for searching GitHub users and viewing their profiles and repositories with OAuth authentication.

## Features

- 🔍 **Public Search**: Search any GitHub user by username and view their public profile
- 🔐 **GitHub OAuth Login**: Authenticate with GitHub to view your personal dashboard
- 📊 **Dashboard**: View your top 10 repositories with detailed information
- 🎨 **Light/Dark Mode**: Toggle between light and dark themes with persistence
- 📱 **Responsive Design**: Fully responsive layout for mobile, tablet, and desktop
- ✅ **Complete Test Coverage**: Unit tests with Vitest for all components and services

## Tech Stack

- **Framework**: Angular 21.1.3 with standalone components
- **Language**: TypeScript 5.9.2 (strict mode)
- **Testing**: Vitest 4.0.8
- **Build**: Angular Build (Vite-based)
- **Backend**: Node.js + Express (OAuth proxy server)
- **Package Manager**: npm 11.8.0

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm 11.8.0
- GitHub account (for OAuth features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd github-user-search
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

3. **Set up GitHub OAuth App** (required for login feature)

   Follow the detailed instructions in `OAUTH_SETUP.md`, or quick setup:

   - Go to https://github.com/settings/developers
   - Create a new OAuth App
   - Set callback URL to: `http://localhost:4200/auth/callback`
   - Copy your Client ID and Client Secret

4. **Configure environment variables**

   **Frontend** (`src/environments/environment.development.ts`):
   ```typescript
   export const environment = {
     production: false,
     github: {
       clientId: 'YOUR_CLIENT_ID',
       redirectUri: 'http://localhost:4200/auth/callback',
       scopes: ['user', 'repo']
     },
     proxyUrl: 'http://localhost:3000/api/auth/github/token'
   };
   ```

   **Backend** (`server/.env`):
   ```
   GITHUB_CLIENT_ID=YOUR_CLIENT_ID
   GITHUB_CLIENT_SECRET=YOUR_CLIENT_SECRET
   PORT=3000
   ```

5. **Start the application**

   Open two terminal windows:

   **Terminal 1 - OAuth Proxy Server:**
   ```bash
   cd server
   npm start
   ```

   **Terminal 2 - Angular Dev Server:**
   ```bash
   npm start
   ```

6. **Open the application**

   Navigate to `http://localhost:4200/` in your browser.

## Development

### Development Server

```bash
npm start
```

The application will run at `http://localhost:4200/` with hot module replacement.

**Important**: The OAuth proxy server must also be running for login features to work.

### Building

```bash
npm run build              # Production build
npm run watch              # Development build with watch mode
ng build --configuration development
```

Build artifacts are stored in the `dist/` directory.

### Running Tests

```bash
npm test
```

Tests are written with Vitest and include full coverage of:
- Components (with localStorage/sessionStorage mocks)
- Services (with HTTP client mocks)
- Guards and Interceptors
- Error handling and edge cases

### Code Generation

Angular CLI includes powerful code scaffolding tools:

```bash
ng generate component component-name
ng generate service service-name
ng generate guard guard-name
ng generate --help         # See all available schematics
```

## Project Structure

```
src/app/
├── core/                  # Core functionality
│   ├── guards/            # Route guards (auth)
│   ├── interceptors/      # HTTP interceptors (auth header)
│   ├── models/            # TypeScript interfaces
│   └── services/          # Singleton services
├── features/              # Feature modules
│   ├── auth-callback/     # OAuth callback handler
│   ├── dashboard/         # Authenticated dashboard
│   └── user-search/       # Public search page
└── shared/                # Shared components
    └── components/        # Reusable UI components

server/                    # OAuth proxy server
├── index.js               # Express server
└── .env.example           # Environment template
```

## API Integration

### Public API (No Auth Required)
- `GET https://api.github.com/users/{username}` - Get user profile

### Authenticated API (Requires OAuth)
- `GET https://api.github.com/user` - Get authenticated user
- `GET https://api.github.com/user/repos` - Get user repositories

### OAuth Proxy Server
- `POST http://localhost:3000/api/auth/github/token` - Exchange code for token
- `GET http://localhost:3000/health` - Health check

## Configuration

### TypeScript
- Strict mode enabled
- Angular-specific compiler options
- Path aliases configured

### Prettier
- 100 character print width
- Single quotes
- Angular HTML parser

### Testing
- Vitest configuration with jsdom
- Mock setup for browser APIs (localStorage, sessionStorage)
- Component and service testing utilities

## Documentation

- `CLAUDE.md` - Detailed documentation for AI-assisted development
- `OAUTH_SETUP.md` - Step-by-step OAuth setup guide with troubleshooting
- `server/README.md` - OAuth proxy server documentation
- `IMPLEMENTATION_SUMMARY.md` - Implementation details and decisions

## Security

**Never commit these files** (they are in `.gitignore`):
- `src/environments/environment.ts`
- `src/environments/environment.development.ts`
- `server/.env`

These files contain your OAuth credentials.

## Troubleshooting

### OAuth Issues
See `OAUTH_SETUP.md` for detailed troubleshooting of common OAuth issues.

### Common Issues

**"Cannot find module 'environment'"**
- Create environment files from templates (see Configuration section above)

**"Token exchange failed"**
- Verify both servers are running
- Check that credentials in `server/.env` are correct
- Verify callback URL matches GitHub OAuth app settings

**Tests failing with storage errors**
- Ensure localStorage/sessionStorage mocks are properly configured
- Check test setup in `*.spec.ts` files

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project was created as a demonstration of Angular 21 with GitHub OAuth integration.

## Resources

- [Angular Documentation](https://angular.dev)
- [Angular CLI Overview](https://angular.dev/tools/cli)
- [GitHub OAuth Documentation](https://docs.github.com/en/apps/oauth-apps)
- [GitHub REST API](https://docs.github.com/en/rest)
- [Vitest Documentation](https://vitest.dev)
