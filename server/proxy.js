/**
 * OAuth Proxy Server for GitHub Authentication
 * Handles token exchange to keep client_secret secure on the server
 *
 * IMPORTANT: This server is required for GitHub OAuth flow to work
 * The client_secret MUST NOT be exposed in frontend code
 *
 * Setup:
 * 1. Create a .env file in the server directory
 * 2. Add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET
 * 3. Run: npm install
 * 4. Run: node server/proxy.js
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config({ path: __dirname + '/.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// GitHub OAuth configuration
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// Validate environment variables
if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  console.error('ERROR: Missing required environment variables');
  console.error('Please create a .env file in the server directory with:');
  console.error('GITHUB_CLIENT_ID=your_client_id');
  console.error('GITHUB_CLIENT_SECRET=your_client_secret');
  process.exit(1);
}

/**
 * OAuth token exchange endpoint
 * POST /api/auth/github/token
 * Body: { code: "authorization_code_from_github" }
 */
app.post('/api/auth/github/token', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required' });
  }

  try {
    // Exchange code for access token
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code
      },
      {
        headers: {
          Accept: 'application/json'
        }
      }
    );

    // Check for errors in GitHub response
    if (response.data.error) {
      console.error('GitHub OAuth error:', response.data.error_description);
      return res.status(400).json({
        error: response.data.error_description || 'Failed to exchange code for token'
      });
    }

    // Return access token to client
    res.json(response.data);
  } catch (error) {
    console.error('Token exchange failed:', error.message);
    res.status(500).json({ error: 'Token exchange failed' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'OAuth proxy server is running' });
});

app.listen(PORT, () => {
  console.log(`✅ OAuth proxy server running on http://localhost:${PORT}`);
  console.log(`📝 Client ID: ${GITHUB_CLIENT_ID.substring(0, 8)}...`);
  console.log(`🔒 Client secret: [HIDDEN]`);
  console.log('\n🚀 Ready to handle OAuth token exchanges');
});
