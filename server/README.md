# GitHub OAuth Proxy Server

This server handles the OAuth token exchange for GitHub authentication. It keeps the `client_secret` secure on the server side.

## Setup

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Create GitHub OAuth App:**
   - Go to https://github.com/settings/developers
   - Click "New OAuth App"
   - Fill in the details:
     - Application name: `GitHub User Search`
     - Homepage URL: `http://localhost:4200`
     - Authorization callback URL: `http://localhost:4200/auth/callback`
   - Click "Register application"
   - Copy the **Client ID**
   - Click "Generate a new client secret" and copy the **Client Secret**

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your credentials:
   ```
   GITHUB_CLIENT_ID=your_actual_client_id
   GITHUB_CLIENT_SECRET=your_actual_client_secret
   ```

4. **Update frontend environment:**
   Edit `src/environments/environment.development.ts` and add your Client ID:
   ```typescript
   github: {
     clientId: 'your_actual_client_id',
     // ...
   }
   ```

## Running

Start the proxy server:
```bash
npm start
```

The server will run on http://localhost:3000

## Development

For automatic restarts during development:
```bash
npm run dev
```

## Endpoints

- `POST /api/auth/github/token` - Exchange authorization code for access token
- `GET /health` - Health check endpoint

## Security

- Never commit the `.env` file to version control
- Never expose the `client_secret` in frontend code
- Always use HTTPS in production
- Consider adding rate limiting for production use
