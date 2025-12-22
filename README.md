# Spotify to YouTube Music Transfer

A minimal web app that transfers Spotify playlists to YouTube Music by recreating them as YouTube playlists.

The app authenticates the user with Spotify and Google, fetches tracks from a selected Spotify playlist, searches for matching videos on YouTube, and adds them to a newly created YouTube playlist.

> ⚠️ Playlist matching is automated and may not always be perfect.

---

## Features

- Login with Spotify (read-only playlist access)
- Login with Google (YouTube Data API)
- Select any Spotify playlist from your account
- Create a private YouTube playlist
- Add matched tracks automatically
- Progress tracking with retry logic
- No database, no user accounts, no persistent storage

---

## How it works

1. User logs in with **Spotify**
2. User logs in with **Google / YouTube**
3. App fetches playlists from Spotify
4. User selects a playlist
5. App:
   - Searches YouTube for each track
   - Creates a YouTube playlist
   - Adds matched videos one by one

All playlist processing happens **in the browser**.  
OAuth token exchange is handled via secure backend endpoints.

---

## Spotify API Limitation

Due to recent changes in Spotify’s developer platform (2025), apps created by
individual developers operate in **development mode** by default.

In this mode:
- Only explicitly allowlisted Spotify users (up to 25) can authenticate
- Public access for unlimited users requires an approved organization account
- This restriction is enforced by Spotify and cannot be bypassed in code

As a result, this app cannot be used by arbitrary Spotify accounts unless they
are added to the allowlist in the Spotify Developer Dashboard.

---

## Bring Your Own Spotify Credentials (Optional)

Advanced users may modify the app to use their own Spotify OAuth credentials.
By doing so, each user authenticates with their own Spotify developer app,
avoiding the allowlist restriction.

This approach is commonly used by open-source Spotify tools but is not enabled
by default to keep the app simple and secure.

---

## Tech Stack

- Frontend: Vanilla HTML, CSS, JavaScript
- Backend: Vercel Serverless Functions
- APIs:
  - Spotify Web API
  - YouTube Data API v3
- OAuth:
  - Spotify OAuth 2.0 with PKCE
  - Google OAuth 2.0

---

## Security & Privacy

- No client secrets in frontend
- OAuth token exchange handled server-side
- Tokens stored only in `sessionStorage`
- No databases
- No analytics
- No logging of personal data
- No playlists or tokens stored on any server

This app only accesses the minimum scopes required to perform playlist transfer.

---

## Quota Limitations

The YouTube Data API uses a quota system.

- Each track transfer uses:
  - `search.list` (100 units)
  - `playlistItems.insert` (50 units)
- Default daily quota is **10,000 units**

Large playlists may exceed the daily quota.  
Quota resets daily at **midnight Pacific Time**.

---

## Running locally

### 1. Clone the repository

```bash
git clone https://github.com/your-username/spotify-to-youtube-transfer.git
cd spotify-to-youtube-transfer
````

### 2. Create OAuth apps

You must create your own OAuth credentials:

#### Spotify

* Create an app at [https://developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
* Add redirect URI:

  ```
  http://localhost:3000/
  ```

#### Google

* Create a project in Google Cloud Console
* Enable **YouTube Data API v3**
* Configure OAuth consent screen
* Add redirect URI:

  ```
  http://localhost:3000/
  ```

---

### 3. Set environment variables

Create a `.env` file (for local use):

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
REDIRECT_URI=http://localhost:3000/
```

---

### 4. Run locally

Use any static server. Example:

```bash
npx serve .
```

Open:

```
http://localhost:3000
```

---

## Deployment

This project is designed for **Vercel**.

* Frontend: static HTML
* Backend: `/api/*` serverless functions
* Environment variables configured in Vercel dashboard

---

## Limitations

* Automated matching may choose incorrect videos
* YouTube API quota limits daily usage
* No support for:

  * Liked Songs (Spotify limitation)
  * Collaborative playlists
  * YouTube Music–specific metadata

---

## Who can use this app?

- ✅ The app owner and allowlisted Spotify users
- ✅ Testers, friends, or reviewers added to the allowlist
- ❌ Arbitrary public Spotify users (Spotify policy restriction)

Google / YouTube authentication works for all users. The limitation applies
only to Spotify authentication.

---

## Why this limitation exists

Spotify now requires apps that want unrestricted public access to apply for
extended quota and partner access.

As of May 2025:
- Extended quota requests are accepted only from organizations
- Individual developers cannot switch apps to unrestricted production mode

This project complies fully with Spotify’s developer policies.

---

## Intended Use

This project is intended as:
- A personal utility
- A technical demonstration of OAuth, API integration, and frontend/backend design
- A portfolio project showcasing real-world API constraints and solutions

It is not intended to be a commercial or large-scale public service.

---

## License

MIT License

---

## Disclaimer

This project is not affiliated with Spotify or Google.

Spotify and YouTube are trademarks of their respective owners.
