# PHP authentication (Google OAuth + email/password)

Session-based auth for **shared PHP hosting** — no separate Node.js
deployment required. The static marketing site (`apps/website/out/`) and
this PHP auth (`php-auth/`) are both FTP-deployed to the same document root
and run side-by-side on Apache.

This exists because `apps/website` is a fully static export with nowhere to
send login/register/Google-auth requests once deployed — `services/backend`
(Node) has never been hosted anywhere reachable from the live site. This is
the same pattern already proven on another project on the same kind of
shared hosting (see the sibling `aebada/ai-pass` repo's `docs/PHP-AUTH.md`),
ported here with AURIX branding and no functional changes.

## Architecture

```text
Browser
  ├─ /, /login, …              → static HTML (Next export)
  ├─ /auth/login.php           → PHP login + email/password
  ├─ /auth/register.php        → PHP register + email/password
  ├─ /auth/google.php          → OAuth redirect to Google
  ├─ /auth/google-callback.php → OAuth callback, session cookie
  ├─ /auth/logout.php          → destroy session
  └─ /auth/me.php              → JSON session check
```

| Piece | Location |
|-------|----------|
| PHP library | `php-auth/auth-lib/` |
| Public routes | `php-auth/auth/` |
| SQL migration | `php-auth/sql/001_users.sql` |
| Composer deps | `vlucas/phpdotenv` only — Google OAuth uses plain cURL against Google's endpoints directly (`google/apiclient` pulls in ~370MB of generated bindings for every Google API just to use two HTTP calls) |

## Local development

```bash
cd php-auth
composer install
cp auth-lib/.env.example auth-lib/.env
# Edit auth-lib/.env — for local testing without a MySQL server, set:
#   DB_DRIVER=sqlite
#   DB_NAME=/tmp/aurix-dev.sqlite
# then create the schema once:
php -r "(new PDO('sqlite:/tmp/aurix-dev.sqlite'))->exec(file_get_contents('sql/001_users.sqlite.sql'));"

php -S localhost:8080 -t .
# Open http://localhost:8080/auth/login.php
```

Set `GOOGLE_REDIRECT_URI=http://localhost:8080/auth/google-callback.php` in
Google Cloud Console for local testing (Authorized redirect URIs).

Production always uses `DB_DRIVER=mysql` (the default) — SQLite is a local
convenience only, not something shared hosting is expected to support.

## Production setup

### Server directory layout

After FTP deploy, the document root looks like:

```text
public_html/                (or wherever your host's FTP docroot is)
├── index.html               ← static Next export (apps/website)
├── ...
├── auth/
│   ├── login.php
│   ├── register.php
│   ├── google.php
│   ├── google-callback.php
│   ├── logout.php
│   ├── me.php
│   └── styles.css
└── auth-lib/                ← NOT browsable (.htaccess denies all)
    ├── .env                 ← YOU CREATE THIS on the server (secrets)
    ├── .htaccess
    ├── bootstrap.php
    ├── vendor/
    └── src/
```

**Where to store secrets:** `auth-lib/.env` on the server. It's blocked by
`auth-lib/.htaccess` (`Require all denied`) — never put `.env` in `auth/`
or the docroot root, and never commit it to this repo.

### Environment variables (auth-lib/.env)

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `APP_URL` | Yes | `https://aurixapp.de` | Public site URL (no trailing slash) |
| `APP_ENV` | Yes | `production` | Enables secure session cookies |
| `DB_DRIVER` | No | `mysql` | `mysql` in production (default), `sqlite` for local testing only |
| `DB_HOST` | Yes | `localhost` | MySQL host |
| `DB_PORT` | No | `3306` | MySQL port |
| `DB_NAME` | Yes | *(from your host's DB panel)* | Database name |
| `DB_USER` | Yes | *(from your host's DB panel)* | Database user |
| `DB_PASS` | Yes | *(from your host's DB panel)* | Database password |
| `GOOGLE_CLIENT_ID` | Yes | `….apps.googleusercontent.com` | OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | *(from Google Console)* | OAuth client secret — required for this server-side flow, unlike the client-side ID-token flow used elsewhere in this repo |
| `GOOGLE_REDIRECT_URI` | Yes | `https://aurixapp.de/auth/google-callback.php` | Must match Google Console exactly |
| `SESSION_SECRET` | Recommended | `openssl rand -hex 32` | Session ID entropy hint |
| `LOGIN_SUCCESS_URL` | No | `/` | Default redirect after login |

### Google Cloud Console

The existing AURIX OAuth client (see `apps/website/src/components/GoogleSignInButton.tsx`
for the client-side flow used elsewhere) needs its **Authorized redirect URIs**
extended to include:

```text
https://aurixapp.de/auth/google-callback.php
```

The client-side flow only needs Authorized JavaScript origins; this
server-side flow additionally needs the redirect URI above, and needs the
Client **Secret** (safe here — it stays in `auth-lib/.env` on the server,
never sent to the browser).

### Database migration

Run `php-auth/sql/001_users.sql` once via your host's phpMyAdmin (or `mysql`
CLI if available).

### Deploy

The `Deploy Website (FTP)` GitHub Actions workflow builds `composer install`
in CI and uploads `php-auth/auth/` and `php-auth/auth-lib/` (excluding
`.env`) alongside the static export — see
`.github/workflows/deploy-website.yml`. After the first deploy:

1. Create `auth-lib/.env` on the server from `auth-lib/.env.example`.
2. Run the SQL migration in phpMyAdmin.
3. Add the redirect URI in Google Console (above).
4. Verify:
   - `https://aurixapp.de/auth/login.php` — login form loads
   - `https://aurixapp.de/auth/google.php` — redirects to Google
   - After sign-in → the configured `LOGIN_SUCCESS_URL`, signed in
   - `https://aurixapp.de/auth/me.php` — JSON `{"authenticated":true,...}`

## User linking

- Google sign-in **upserts by email** — no duplicate users.
- Existing email/password account → Google linked (`auth_provider = linked`).
- New Google user → `auth_provider = google`.

## Security

- CSRF tokens on login/register forms.
- OAuth `state` parameter (single-use, session-bound).
- Session cookie: `AURIX_SESSION`, `HttpOnly`, `SameSite=Lax`, `Secure` in production.
- `auth-lib/` denied via `.htaccess`.
- Never commit `auth-lib/.env` or real secrets.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `redirect_uri_mismatch` | Add the exact `GOOGLE_REDIRECT_URI` in Google Console |
| Blank page / 500 on auth | Check the PHP error log; verify `vendor/` was uploaded |
| Database connection failed | Verify `DB_*` in `auth-lib/.env` |
| Session not persisting | `APP_ENV=production` requires HTTPS |
| `auth-lib/.env` exposed | Ensure `auth-lib/.htaccess` was deployed |
