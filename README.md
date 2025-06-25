# Spotitunes
Search music from both Spotify and Apple Music. All in your terminal.
Feel free to explore, but don't rely on anything just yet.

## TODO
- [ ] YTM API Implementation
- [ ] Link parsing
- [x] Enable iTunes API
- [ ] Better styling

Contributions, ideas, and bug reports are welcome.

---

# Setup Instructions

## Getting Spotify API Credentials

### 1. Create a Spotify App
1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click **"Create app"**
4. Fill out the form:
   - **App name**: Whatever you want (e.g. "meow")
   - **App description**: Brief description
   - **Redirect URI**: `https://www.google.com` (or your preferred URL)
   - **APIs used**: Web API
5. Accept the terms and create the app
6. Click on your new app to view its details
7. Copy your **Client ID** and **Client Secret** (click "View client secret")

## Setting Environment Variables

### Windows (Command Prompt)
```cmd
set SPOTIFY_CLIENT=your_client_id_here
set SPOTIFY_SECRET=your_client_secret_here
```

### Windows (PowerShell)
```powershell
$env:SPOTIFY_CLIENT="your_client_id_here"
$env:SPOTIFY_SECRET="your_client_secret_here"
```

### Windows (Permanent)
1. Open System Properties → Advanced → Environment Variables
2. Under "User variables", click **New**
3. Add `SPOTIFY_CLIENT` with your client ID
4. Add `SPOTIFY_SECRET` with your client secret
5. Restart your terminal/IDE

### macOS/Linux (Bash/Zsh)
```bash
export SPOTIFY_CLIENT="your_client_id_here"
export SPOTIFY_SECRET="your_client_secret_here"
```

### macOS/Linux (Permanent)
Add to your shell profile (`~/.bashrc`, `~/.zshrc`, or `~/.profile`):
```bash
export SPOTIFY_CLIENT="your_client_id_here"
export SPOTIFY_SECRET="your_client_secret_here"
```
Then run `source ~/.bashrc` (or your profile file) to reload.

## Alternative: .env File
Create a `.env` file in your project root:
```bash
export SPOTIFY_CLIENT=your_client_id_here
export SPOTIFY_SECRET=your_client_secret_here
```

Then source it:
```bash
source .env
```

**Note**: Never commit this file to version control. Add `.env` to your `.gitignore`.

## Verification
Test that your environment variables are set:

**Windows (CMD/PowerShell):**
```cmd
echo %SPOTIFY_CLIENT%
echo %SPOTIFY_SECRET%
```

**macOS/Linux:**
```bash
echo $SPOTIFY_CLIENT
echo $SPOTIFY_SECRET
```

Both should output your credentials (not "undefined" or empty).

## Using Releases
Pre-built releases require you to set up your own Spotify API credentials using any of the methods above. This ensures better performance, no rate limiting issues, and keeps your usage private.
