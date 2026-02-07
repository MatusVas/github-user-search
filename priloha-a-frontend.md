# Príloha A: Zadanie - Frontend

## Vytvoriť funkčnú GitHub Dashboard aplikáciu

### Časť 1: Public Search (Podľa Figmy github-user-search-app.fig)

**Features:**
- Search by username
- Display public profile:
  - Avatar, meno, username
  - Bio, location, website
  - Stats: Public Repos | Followers | Following
  - Join date
  - Repos count
- Responsive design (mobile + desktop)
- Light mode / Dark mode

**API:**
```
GET https://api.github.com/users/{username}
```


### 🔐 Časť 2: GitHub OAuth Login

**Features:**
- Login button ("Sign in with GitHub")
- OAuth flow
- Session management (login / logout)
- Display logged-in user:
  - Avatar a meno v navbar
  - Logout button
- Protected dashboard route
  - Show public repos list (top 10):
    - Repo name (link na GitHub)
    - Description
    - Stars count
    - Primary language
    - Last updated
