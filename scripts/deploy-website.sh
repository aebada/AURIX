#!/usr/bin/env bash
# Safe deploy for shared hosting: static Next export + php-auth to the same docroot.
# NEVER rsync --delete on the full public_html without excluding auth/ and auth-lib/.
# NEVER overwrite or delete live auth-lib/.env (create once on server — docs/PHP-AUTH.md).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# --- Remote target (override via env) ---
: "${DEPLOY_SSH_HOST:=u234903558@92.113.19.130}"
: "${DEPLOY_SSH_PORT:=65002}"
: "${DEPLOY_SSH_KEY:=${HOME}/.ssh/id_ed25519_munichtechexpo}"
: "${DEPLOY_REMOTE_DIR:=domains/aurixapp.de/public_html}"

RSYNC_SSH="ssh -p ${DEPLOY_SSH_PORT} -i ${DEPLOY_SSH_KEY} -o BatchMode=yes"
REMOTE="${DEPLOY_SSH_HOST}:${DEPLOY_REMOTE_DIR}/"

echo "==> Build static site (apps/website)"
(
  cd apps/website
  npm ci
  export NEXT_PUBLIC_GOOGLE_CLIENT_ID="${NEXT_PUBLIC_GOOGLE_CLIENT_ID:-148156861979-ua974fq9iatjv2gvfneh9cga49efb0mm.apps.googleusercontent.com}"
  export NEXT_PUBLIC_USE_PHP_AUTH="${NEXT_PUBLIC_USE_PHP_AUTH:-1}"
  npm run build
)

echo "==> Install php-auth dependencies"
(
  cd php-auth
  composer install --no-dev --optimize-autoloader
)

if [[ -f php-auth/auth-lib/.env ]]; then
  echo "ERROR: php-auth/auth-lib/.env exists locally — remove it; secrets live only on the server." >&2
  exit 1
fi

echo "==> Rsync static export (excludes auth + auth-lib; --delete safe only for site files)"
rsync -avz --delete \
  -e "$RSYNC_SSH" \
  --exclude 'auth' \
  --exclude 'auth-lib' \
  apps/website/out/ \
  "$REMOTE"

echo "==> Rsync php-auth (no --delete; never touch auth-lib/.env)"
rsync -avz \
  -e "$RSYNC_SSH" \
  --exclude '.git' \
  --exclude 'sql/' \
  --exclude 'composer.json' \
  --exclude 'composer.lock' \
  --exclude '.gitignore' \
  --exclude '.env.example' \
  --exclude 'auth-lib/.env' \
  --exclude 'auth-lib/.env.example' \
  php-auth/ \
  "$REMOTE"

APK="${ROOT}/apps/mobile-flutter/build/app/outputs/flutter-apk/app-release.apk"
if [[ -f "$APK" ]]; then
  echo "==> Rsync Android APK → downloads/aurix-mobile.apk"
  rsync -avz -e "$RSYNC_SSH" "$APK" "${REMOTE}downloads/aurix-mobile.apk"
else
  echo "WARN: APK not found at $APK — run: cd apps/mobile-flutter && flutter build apk --release"
fi

echo "==> Deploy complete → ${DEPLOY_SSH_HOST}/${DEPLOY_REMOTE_DIR}"
