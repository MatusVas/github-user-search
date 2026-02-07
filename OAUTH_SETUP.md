# GitHub OAuth Setup Guide

This guide will help you set up GitHub OAuth authentication for the GitHub User Search application.

## Prerequisites

- Node.js (v18 or higher)
- GitHub account
- npm installed

## Step 1: Register GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click **"New OAuth App"** or **"Register a new application"**
3. Fill in the application details:
   - **Application name**: `GitHub User Search` (or any name you prefer)
   - **Homepage URL**: `http://localhost:4200`
   - **Application description**: (optional) `Search GitHub users and view repositories`
   - **Authorization callback URL**: `http://localhost:4200/auth/callback`
4. Click **"Register application"**
5. On the next page:
   - Copy the **Client ID** (you'll need this for both frontend and backend)
   - Click **"Generate a new client secret"**
   - Copy the **Client Secret** (you'll need this for the backend only)
   - ⚠️ **IMPORTANT**: Save the client secret immediately - you won't be able to see it again!

## Step 2: Configure Frontend Environment

1. Navigate to the project root directory
2. Copy the example environment file:
   ```bash
   cp src/environments/environment.example.ts src/environments/environment.development.ts
   ```

3. Edit `src/environments/environment.development.ts`:
   ```typescript
   export const environment = {
     production: false,
     github: {
       clientId: 'YOUR_GITHUB_CLIENT_ID_HERE', // Paste your Client ID
       redirectUri: 'http://localhost:4200/auth/callback',
       scopes: ['user', 'repo']
     },
     proxyUrl: 'http://localhost:3000/api/auth/github/token'
   };
   ```

4. Also create `src/environments/environment.ts` for production (with same Client ID):
   ```bash
   cp src/environments/environment.development.ts src/environments/environment.ts
   ```

## Step 3: Configure Backend Proxy

The proxy server handles the OAuth token exchange securely (keeping the client secret hidden).

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Edit `server/.env`:
   ```
   GITHUB_CLIENT_ID=YOUR_GITHUB_CLIENT_ID_HERE
   GITHUB_CLIENT_SECRET=YOUR_GITHUB_CLIENT_SECRET_HERE
   PORT=3000
   ```

4. Install server dependencies:
   ```bash
   npm install
   ```

## Step 4: Start the Application

You need to run both the backend proxy server and the Angular frontend.

### Terminal 1: Start the proxy server
```bash
cd server
npm start
```

You should see:
```
✅ OAuth proxy server running on http://localhost:3000
📝 Client ID: Iv1.abcd1234...
🔒 Client secret: [HIDDEN]
🚀 Ready to handle OAuth token exchanges
```

### Terminal 2: Start the Angular dev server
```bash
# From project root
npm start
```

The application will open at http://localhost:4200

## Step 5: Test the OAuth Flow

1. Open http://localhost:4200 in your browser
2. Click **"Sign in with GitHub"** button in the header
3. You'll be redirected to GitHub authorization page
4. Click **"Authorize"** to grant access
5. You'll be redirected back to your app's dashboard
6. You should see:
   - Your avatar and name in the header
   - Your top 10 repositories displayed
   - A **"Logout"** button

## Troubleshooting

### Error: "redirect_uri_mismatch"

**Problem**: The callback URL doesn't match what's registered on GitHub

**Solution**:
- Check that your GitHub OAuth App callback URL is exactly: `http://localhost:4200/auth/callback`
- Make sure `environment.development.ts` has the same URL

### Error: "Token exchange failed"

**Problem**: The proxy server can't exchange the code for a token

**Solutions**:
1. Verify the proxy server is running on port 3000
2. Check that `server/.env` has correct credentials
3. Verify your Client Secret is correct (may need to regenerate on GitHub)

### Error: "No authorization code received"

**Problem**: GitHub didn't redirect back with a code

**Solutions**:
1. Check browser console for errors
2. Verify GitHub OAuth App is active
3. Try logging out of GitHub and logging back in

### Dashboard shows "Failed to load repositories"

**Problem**: The access token isn't being sent or is invalid

**Solutions**:
1. Check browser DevTools Network tab - look for Authorization header
2. Open browser console and check for errors
3. Try logging out and logging back in
4. Verify the HTTP interceptor is registered in `app.config.ts`

## Security Notes

### ⚠️ Never Commit Secrets!

The following files are already in `.gitignore` and should **NEVER** be committed:

- `src/environments/environment.ts`
- `src/environments/environment.development.ts`
- `server/.env`

### ✅ What's Safe to Commit

- `src/environments/environment.example.ts` ✅
- `server/.env.example` ✅
- `server/README.md` ✅

### Production Deployment

For production deployment:

1. **Frontend**: Set `clientId` in environment.ts to your production OAuth app's Client ID
2. **Backend**: Deploy the proxy server separately with proper environment variables
3. **Update URLs**: Change all `localhost:4200` references to your production domain
4. **Use HTTPS**: Always use HTTPS in production
5. **Rate Limiting**: Add rate limiting to the proxy server
6. **CORS**: Configure CORS properly for your production domain

## API Endpoints Used

### GitHub API (Authenticated)
- `GET https://api.github.com/user` - Get authenticated user profile
- `GET https://api.github.com/user/repos` - Get user repositories

### Proxy Server
- `POST http://localhost:3000/api/auth/github/token` - Exchange authorization code for access token
- `GET http://localhost:3000/health` - Health check

## Features Implemented

✅ GitHub OAuth 2.0 authentication flow
✅ Secure token exchange via backend proxy
✅ Protected dashboard route (requires auth)
✅ Display authenticated user info in header
✅ Show top 10 repositories with:
  - Repository name (link to GitHub)
  - Description
  - Stars count
  - Primary language
  - Last updated date
✅ Login/Logout functionality
✅ Token persistence (survives page refresh)
✅ Theme toggle (light/dark mode)
✅ Responsive design (mobile + desktop)

## Need Help?

If you encounter issues:

1. Check the browser console for errors
2. Check the proxy server terminal for errors
3. Verify all environment variables are set correctly
4. Make sure both servers are running
5. Try the troubleshooting steps above

For more information:
- [GitHub OAuth Documentation](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
- [GitHub REST API Documentation](https://docs.github.com/en/rest)
