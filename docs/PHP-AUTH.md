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
  ├─ /auth/google.php          → OAuth start (AI-Pass bridge or direct Google)
  ├─ /auth/google/callback     → Bridge token / OAuth callback (HOPn path; → google-callback.php)
  ├─ /auth/google-callback.php → Legacy alias of the same callback handler
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

Set `GOOGLE_REDIRECT_URI=http://localhost:8080/auth/google/callback` in
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
| `GOOGLE_CLIENT_ID` | Yes | `….apps.googleusercontent.com` | Shared AlPass / AI-Pass OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | *(from Google Console)* | OAuth client secret — also used as the bridge HMAC secret when `AIPASS_OAUTH_BRIDGE_SECRET` is unset |
| `GOOGLE_REDIRECT_URI` | Direct only | `https://aurixapp.de/auth/google/callback` | Used when bridge is off; must match Google Console (HOPn path) |
| `AIPASS_AUTH_URL` | Bridge | `https://aipass.space` | AI-Pass host that owns the registered Google redirect URI |
| `AIPASS_OAUTH_BRIDGE` | Bridge | `true` | Production default — same pattern as Invoice AI |
| `AIPASS_OAUTH_BRIDGE_SECRET` | Bridge | *(defaults to `GOOGLE_CLIENT_SECRET`)* | Must match AI-Pass `AIPASS_OAUTH_BRIDGE_SECRET` / Google secret |
| `SESSION_SECRET` | Recommended | `openssl rand -hex 32` | Session ID entropy hint |
| `LOGIN_SUCCESS_URL` | No | `/` | Default redirect after login |

### Google OAuth — AI-Pass bridge (production)

AURIX reuses the **same AlPass Web client** as AI-Pass / Invoice AI. Google Console
already has:

```text
https://aipass.space/auth/google/callback
```

Production flow (no new Console redirect URI required for `aurixapp.de`):

1. Browser → `https://aurixapp.de/auth/google.php` (or `/auth/google`)
2. Redirect → `https://aipass.space/auth/google?bridge=1&callback=https://aurixapp.de/auth/google/callback`
3. Google consent uses `redirect_uri=https://aipass.space/auth/google/callback`
4. AI-Pass returns `?bridge_token=…` to AURIX; php-auth verifies HMAC and sets session

**Note:** Local Carbon (`carbon.ehopn.com`) has no Google login. AURIX follows
the Invoice AI bridge + HOPn callback path (`/auth/google/callback`) used by
sibling apps on the same Hostinger account (Sportify, Oktoberhub, Invoice).

**AI-Pass requirement:** add `aurixapp.de` to `AIPASS_TRUSTED_CALLBACK_HOSTS` on the
AI-Pass Laravel `.env` (and redeploy/clear config cache if applicable).

### Google Cloud Console (direct / local only)

Set `AIPASS_OAUTH_BRIDGE=false` (or `APP_ENV=local`) and register:

```text
https://aurixapp.de/auth/google/callback
```

(plus `http://localhost:8080/auth/google/callback` for local PHP). The
client-side GIS button only needs Authorized JavaScript origins
(`https://aurixapp.de`); the bridge path does not need AURIX as a redirect URI.

### Database migration

Run `php-auth/sql/001_users.sql` once via your host's phpMyAdmin (or `mysql`
CLI if available).

### Deploy

The `Deploy Website (FTP)` GitHub Actions workflow builds `composer install`
in CI and uploads `php-auth/auth/` and `php-auth/auth-lib/` (excluding
`.env`) alongside the static export — see
`.github/workflows/deploy-website.yml`. After the first deploy:

1. Create `auth-lib/.env` on the server from `auth-lib/.env.example` (bridge on).
2. Run the SQL migration in phpMyAdmin.
3. Ensure AI-Pass `AIPASS_TRUSTED_CALLBACK_HOSTS` includes `aurixapp.de`.
4. Verify:
   - `https://aurixapp.de/auth/login.php` — login form loads
   - `https://aurixapp.de/auth/google.php` — redirects to `aipass.space/auth/google?bridge=1…`
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

## Inquiries (contact / investors)

`POST /auth/investor-inquiry.php` persists JSON under `auth-lib/data/inquiries.json`, then best-effort:

1. **Hostinger Mail SMTP** notify to `MAIL_NOTIFY_TO` (default `contact@aurixapp.de`) + optional auto-reply (`MAIL_AUTO_REPLY`)
2. **MTE CRM** upsert via `{MTE_CRM_BASE}/upsert-outreach-lead` with tags `AURIX` / `email_source=aurix_website`

Configure `SMTP_*` and `MTE_CRM_*` in `auth-lib/.env` (see `.env.example`). Intake still returns `201` if mail/CRM side effects fail after a successful persist.

### Hostinger Mail (contact@aurixapp.de)

Use **Hostinger Mail** only — not Gmail or a third-party relay. The mailbox password is for SMTP/IMAP auth only; **never** reuse it as FTP/SSH deploy credentials.

| Setting | Value |
|---------|--------|
| SMTP host | `smtp.hostinger.com` |
| SMTP port | `465` with `SMTP_ENCRYPTION=ssl` (or `587` with `STARTTLS`) |
| IMAP host (Outlook / clients) | `imap.hostinger.com` |
| IMAP port | `993` SSL |
| Username | full address `contact@aurixapp.de` |
| From / notify | `contact@aurixapp.de` (`SMTP_FROM`, `MAIL_NOTIFY_TO`) |

Put `SMTP_PASS` only in server `auth-lib/.env`. IMAP is for reading the mailbox in clients; php-auth sends via SMTP only.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `redirect_uri_mismatch` | Prefer bridge mode (`AIPASS_OAUTH_BRIDGE=true`) so Google only sees `aipass.space`’s registered URI; for direct mode, add exact `GOOGLE_REDIRECT_URI` in Google Console |
| Bridge returns to login / invalid token | Confirm `GOOGLE_CLIENT_SECRET` matches AI-Pass; confirm `aurixapp.de` is in AI-Pass `AIPASS_TRUSTED_CALLBACK_HOSTS` |
| Blank page / 500 on auth | Check the PHP error log; verify `vendor/` was uploaded |
| `Auth library is incomplete` / `Auth is not configured` | Deploy `auth-lib/bootstrap.php` + `vendor/`, and create `auth-lib/.env` from `.env.example` |
| `/auth/login.php` 404 | `auth/*.php` missing from docroot — redeploy `php-auth/` (CI now asserts these files exist before FTP) |
| Database connection failed | Verify `DB_*` in `auth-lib/.env` |
| Session not persisting | `APP_ENV=production` requires HTTPS |
| `auth-lib/.env` exposed | Ensure `auth-lib/.htaccess` was deployed |
| Inquiry saved but no email / CRM | Set Hostinger `SMTP_*` (`smtp.hostinger.com:465` SSL) and `MTE_CRM_KEY` on the server `.env`; check `notified` flags in the JSON response |
| SMTP connect timeout from laptop | Expected off-Hostinger; mail works after php-auth + server `.env` are on production |
