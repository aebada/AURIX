// Thin client for services/backend. Base URL is configurable so the admin
// portal can point at a locally-run backend during development or a
// deployed one later — see .env.example.

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
};

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  kycStatus: "unverified" | "pending" | "verified" | "rejected";
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: "buy" | "sell" | "transfer" | "deposit" | "withdrawal";
  fromUserId?: string;
  toUserId?: string;
  asset: "GOLD" | "SILVER" | "FIAT";
  amount: number;
  fee: number;
  status: "pending" | "settled" | "failed";
  partnerReference?: string;
  createdAt: string;
}

export const adminApi = {
  users: (token: string) => request<{ users: AdminUser[] }>("/admin/users", {}, token),
  transactions: (token: string) =>
    request<{ transactions: Transaction[] }>("/admin/transactions", {}, token),
  kycQueue: (token: string) =>
    request<{ pending: { id: string; email: string; fullName: string }[] }>(
      "/admin/kyc-queue",
      {},
      token,
    ),
  kycDecision: (token: string, userId: string, decision: "verified" | "rejected") =>
    request<{ id: string; kycStatus: string }>(
      `/admin/kyc/${userId}/decision`,
      { method: "POST", body: JSON.stringify({ decision }) },
      token,
    ),
};
