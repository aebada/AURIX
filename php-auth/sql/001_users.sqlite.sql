-- SQLite equivalent of 001_users.sql — for local testing only (DB_DRIVER=sqlite
-- in auth-lib/.env). Production on shared hosting always uses MySQL — see
-- 001_users.sql. Not run automatically; see auth-lib/README.md.

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NULL,
  name TEXT NULL,
  google_id TEXT NULL UNIQUE,
  avatar_url TEXT NULL,
  auth_provider TEXT NOT NULL DEFAULT 'email',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  last_login_at TEXT NULL
);
