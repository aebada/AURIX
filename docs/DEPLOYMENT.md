# Deploying the Website

The marketing site (`apps/website`) is configured for **static export**
(`output: "export"` in `next.config.ts`) — plain HTML/CSS/JS with no Node
runtime required. This matches shared hosting with no VPS (e.g. Hostinger).

## Automatic deploy via GitHub Actions

`.github/workflows/deploy-website.yml` builds the site and uploads it over
FTP whenever `apps/website/**` changes on `main` (or via manual dispatch from
the Actions tab).

This repo's sandboxed sessions cannot reach arbitrary hosts over FTP or
HTTPS, so this workflow — running on GitHub's own runners — is the
supported path to production, not a direct push from a Claude Code session.

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

## Manual deploy

If you'd rather deploy by hand:

```bash
cd apps/website
npm ci
npm run build     # outputs static site to apps/website/out/
```

Upload the contents of `apps/website/out/` to the host's document root via
any FTP client.
