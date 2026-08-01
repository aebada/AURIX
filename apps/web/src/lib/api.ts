// Thin client for services/backend. Base URL is configurable so the
// dashboard can point at a locally-run backend during development or a
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
  taxId?: string | null;
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
};

export type Asset = "GOLD" | "SILVER" | "FIAT";

export interface WalletBalance {
  userId: string;
  asset: Asset;
  balance: number;
}

export interface Transaction {
  id: string;
  type: "buy" | "sell" | "transfer" | "deposit" | "withdrawal";
  fromUserId?: string;
  toUserId?: string;
  asset: Asset;
  amount: number;
  fee: number;
  status: "pending" | "settled" | "failed";
  partnerReference?: string;
  createdAt: string;
}

export const walletApi = {
  balances: (token: string) => request<{ balances: WalletBalance[] }>("/wallet", {}, token),
  transactions: (token: string) =>
    request<{ transactions: Transaction[] }>("/wallet/transactions", {}, token),
  transfer: (token: string, toEmail: string, asset: Asset, amount: number) =>
    request<{ transaction: Transaction }>(
      "/wallet/transfer",
      { method: "POST", body: JSON.stringify({ toEmail, asset, amount }) },
      token,
    ),
};

export const paymentsApi = {
  topup: (token: string, amount: number) =>
    request<{ transaction: Transaction; balance: WalletBalance }>(
      "/payments/topup",
      { method: "POST", body: JSON.stringify({ amount }) },
      token,
    ),
  buy: (token: string, asset: "GOLD" | "SILVER", fiatAmount: number, pricePerUnit: number) =>
    request<{ transaction: Transaction }>(
      "/payments/buy",
      { method: "POST", body: JSON.stringify({ asset, fiatAmount, pricePerUnit }) },
      token,
    ),
  sell: (token: string, asset: "GOLD" | "SILVER", units: number, pricePerUnit: number) =>
    request<{ transaction: Transaction }>(
      "/payments/sell",
      { method: "POST", body: JSON.stringify({ asset, units, pricePerUnit }) },
      token,
    ),
};

export interface MarketPrices {
  goldUsdPerGram: number;
  silverUsdPerGram: number;
  btcUsd: number;
  eurUsd: number;
}

export const marketApi = {
  prices: () => request<{ asOf: string; prices: MarketPrices }>("/market-data/prices"),
};

export interface ChatReply {
  reply: string;
  provider: string;
}

export const chatApi = {
  send: (
    token: string,
    message: string,
    history: { role: "user" | "assistant"; content: string }[] = [],
  ) =>
    request<ChatReply>(
      "/chat/message",
      { method: "POST", body: JSON.stringify({ message, history }) },
      token,
    ),
};

export const kycApi = {
  status: (token: string) => request<{ kycStatus: string }>("/kyc/status", {}, token),
  submit: (token: string) =>
    request<{ kycStatus: string }>("/kyc/submit", { method: "POST" }, token),
};

export const usersApi = {
  me: (token: string) => request<AuthUser>("/users/me", {}, token),
  setTaxId: (token: string, taxId: string) =>
    request<{ taxId: string }>(
      "/users/me/tax-id",
      { method: "POST", body: JSON.stringify({ taxId }) },
      token,
    ),
};

export type EtfCategory =
  | "equity"
  | "bond"
  | "dividend"
  | "esg"
  | "sector"
  | "commodity"
  | "islamic";

export interface Etf {
  ticker: string;
  isin: string;
  name: string;
  provider: string;
  category: EtfCategory;
  theme: string;
  exchange: string;
  currency: string;
  price: number;
  expenseRatioPct: number;
  dividendYieldPct: number;
  oneYearReturnPct: number;
  riskLevel: "low" | "medium" | "high";
  minInvestment: number;
  fractionalSupported: boolean;
  description: string;
  topHoldings: string[];
}

export interface EtfOrder {
  id: string;
  userId: string;
  ticker: string;
  side: "buy" | "sell";
  units: number;
  pricePerUnitUsd: number;
  fiatAmountUsd: number;
  feeUsd: number;
  status: "settled";
  createdAt: string;
}

export interface EtfHoldingRow {
  ticker: string;
  name: string;
  units: number;
  avgCostUsd: number;
  price: number;
  currentValue: number;
  costBasis: number;
  gainLossUsd: number;
  gainLossPct: number;
}

export const etfApi = {
  list: (params: { country?: string; category?: string; q?: string } = {}) => {
    const search = new URLSearchParams();
    if (params.country) search.set("country", params.country);
    if (params.category) search.set("category", params.category);
    if (params.q) search.set("q", params.q);
    const qs = search.toString();
    return request<{ categories: EtfCategory[]; etfs: Etf[] }>(`/etfs${qs ? `?${qs}` : ""}`);
  },
  detail: (ticker: string) => request<Etf>(`/etfs/${ticker}`),
  portfolio: (token: string) =>
    request<{ holdings: EtfHoldingRow[]; totalValue: number; totalCost: number; totalGainLossUsd: number }>(
      "/etfs/me/portfolio",
      {},
      token,
    ),
  watchlist: (token: string) => request<{ etfs: Etf[] }>("/etfs/me/watchlist", {}, token),
  addToWatchlist: (token: string, ticker: string) =>
    request<{ watchlisted: boolean }>(`/etfs/${ticker}/watchlist`, { method: "POST" }, token),
  removeFromWatchlist: (token: string, ticker: string) =>
    request<{ watchlisted: boolean }>(`/etfs/${ticker}/watchlist`, { method: "DELETE" }, token),
  buy: (token: string, ticker: string, fiatAmount: number) =>
    request<{ order: EtfOrder; balance: WalletBalance }>(
      `/etfs/${ticker}/buy`,
      { method: "POST", body: JSON.stringify({ fiatAmount }) },
      token,
    ),
  sell: (token: string, ticker: string, units: number) =>
    request<{ order: EtfOrder; balance: WalletBalance }>(
      `/etfs/${ticker}/sell`,
      { method: "POST", body: JSON.stringify({ units }) },
      token,
    ),
  orders: (token: string) => request<{ orders: EtfOrder[] }>("/etfs/me/orders", {}, token),
};
