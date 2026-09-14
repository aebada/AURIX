# Deploying the Website

The marketing site (`apps/website`) is configured for **static export**
(`output: "export"` in `next.config.ts`) — plain HTML/CSS/JS with no Node
runtime required. This matches shared hosting with no VPS (e.g. Hostinger).

The static export and `php-auth/` share the same document root on the server
(see `docs/PHP-AUTH.md`). **Never delete `auth/` or `auth-lib/` when syncing
the marketing site**, and **never overwrite or delete live `auth-lib/.env`** —
that file is created once on the server and holds DB/OAuth secrets; CI and
local trees must not ship a copy.

## Automatic deploy via GitHub Actions

`.github/workflows/deploy-website.yml` builds the site and uploads it over
FTP whenever `apps/website/**` changes on `main` (or via manual dispatch from
the Actions tab).

This repo's sandboxed sessions cannot reach arbitrary hosts over FTP or
HTTPS, so this workflow — running on GitHub's own runners — is the
supported path to production, not a direct push from a Claude Code session.

The workflow excludes `auth/**` and `auth-lib/**` from the static-site FTP
sync (shared docroot) and excludes `auth-lib/.env` from the php-auth upload.

### One-time setup

In the repo's **Settings → Secrets and variables → Actions**, add:

| Secret | Value |
|---|---|
| `FTP_SERVER` | The FTP host (IP or hostname) |
| `FTP_USERNAME` | The FTP account username |
| `FTP_PASSWORD` | The FTP account password |
| `FTP_SERVER_DIR` | Remote path to the site's document root, e.g. `/domains/aurixapp.de/public_html/` |

Never commit these values to the repository — they must only exist as
GitHub Actions secrets. If any of them have ever been shared outside of
GitHub's secret storage (chat, email, etc.), rotate them in the hosting
control panel afterward.

## Manual deploy (SSH / rsync)

Use the safe script — do **not** run `rsync --delete` on the full `public_html`
without excluding `auth` and `auth-lib`:

```bash
./scripts/deploy-website.sh
```

Override remote settings if needed:

```bash
DEPLOY_SSH_HOST=u234903558@92.113.19.130 \
DEPLOY_SSH_PORT=65002 \
DEPLOY_SSH_KEY=~/.ssh/id_ed25519_munichtechexpo \
DEPLOY_REMOTE_DIR=domains/aurixapp.de/public_html \
./scripts/deploy-website.sh
```

Equivalent safe rsync (after `npm run build` and `composer install` in
`php-auth/`):

```bash
RSYNC_SSH="ssh -p 65002 -i ~/.ssh/id_ed25519_munichtechexpo"
REMOTE="u234903558@92.113.19.130:domains/aurixapp.de/public_html/"

rsync -avz --delete -e "$RSYNC_SSH" \
  --exclude auth --exclude auth-lib \
  apps/website/out/ "$REMOTE"

rsync -avz -e "$RSYNC_SSH" \
  --exclude auth-lib/.env --exclude sql/ \
  php-auth/ "$REMOTE"
```

## Manual deploy (FTP only)

If you'd rather deploy by hand without the script:

```bash
cd apps/website
npm ci
npm run build     # outputs static site to apps/website/out/
```

Upload the contents of `apps/website/out/` to the host's document root via
any FTP client — **only** static files; do not remove `auth/` or `auth-lib/`.
Deploy `php-auth/` separately (see `docs/PHP-AUTH.md`) without uploading
`auth-lib/.env`.
