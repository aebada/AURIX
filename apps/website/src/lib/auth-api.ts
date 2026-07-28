// Thin client for services/backend auth endpoints. Base URL is
// configurable via NEXT_PUBLIC_API_URL — see .env.example. This mirrors
// apps/web's src/lib/api.ts auth slice, since the marketing site now
// authenticates against the same backend before handing off to the app.

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// The wallet/dashboard app (apps/web) is a separate deployment — this is a
// cross-origin handoff, not an internal route.
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// localStorage is origin-scoped, so a session written here isn't visible
// to apps/web after a plain redirect — the user would land back on its
// own separate login page, signed out. Carry the session across in a URL
// fragment (never sent to any server, unlike a query param) so apps/web's
// bootstrap script can pick it up and write it into its own localStorage
// before its app shell ever renders.
export function buildHandoffUrl(session: { token: string; user: AuthUser }): string {
  const encoded = encodeURIComponent(btoa(JSON.stringify(session)));
  return `${APP_URL}/#session=${encoded}`;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(res.status, body.error ?? `Request failed (${res.status})`);
  }
  return body as T;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  kycStatus: "unverified" | "pending" | "verified" | "rejected";
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const authApi = {
  login: (email: string, password: string) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (email: string, password: string, fullName: string) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, fullName }),
    }),
  google: (idToken: string) =>
    request<AuthResponse>("/auth/google", {
      method: "POST",
      body: JSON.stringify({ idToken }),
    }),
};
