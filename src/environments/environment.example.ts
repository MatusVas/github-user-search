/**
 * Example environment configuration file
 * Copy this file to environment.ts and environment.development.ts
 * Fill in your GitHub OAuth App credentials
 *
 * To create a GitHub OAuth App:
 * 1. Go to https://github.com/settings/developers
 * 2. Click "New OAuth App"
 * 3. Fill in application details:
 *    - Application name: GitHub User Search
 *    - Homepage URL: http://localhost:4200
 *    - Authorization callback URL: http://localhost:4200/auth/callback
 * 4. Copy the Client ID to the clientId field below
 * 5. Generate a Client Secret and store it in your proxy server .env file
 */

export const environment = {
  production: false,
  github: {
    clientId: 'YOUR_GITHUB_CLIENT_ID',
    redirectUri: 'http://localhost:4200/auth/callback',
    scopes: ['user', 'repo']
  },
  proxyUrl: 'http://localhost:3000/api/auth/github/token'
};
