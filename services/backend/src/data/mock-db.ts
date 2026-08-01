// In-memory mock data store.
//
// AURIX never custodies assets directly (see docs/PRODUCT_PLAN.md section 5
// and docs/MOBILE_UX.md). In production, wallet balances here would be a
// reconciled *view* of partner systems (vaults, payment processors,
// brokers), not the source of truth. This mock store simulates that shape
// so the API surface is realistic, without any real provider integration.

import { hashPassword } from "../lib/password.js";

export type Asset = "GOLD" | "SILVER" | "FIAT";

// Ranked low to high — see middleware/require-role.ts. "user" is every
// regular customer (apps/website, apps/web) and has no admin-portal
// access at all; "support" is read-only ops access; "admin" can act on
// users/KYC/monitoring; "super_admin" can additionally change other
// users' roles.
export type Role = "user" | "support" | "admin" | "super_admin";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  createdAt: string;
  kycStatus: "unverified" | "pending" | "verified" | "rejected";
  role: Role;
  // Not collected at registration — the user is prompted for it afterward
  // from the dashboard, since it's not needed to create the account.
  taxId?: string;
}

export interface WalletBalance {
  userId: string;
  asset: Asset;
  // Smallest atomic unit: 0.0001g for GOLD/SILVER (see docs/PRODUCT_PLAN.md
  // "Gold Tokenization Model"), minor units (cents) for FIAT.
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
  partnerReference?: string; // never a real provider ref in this mock
  createdAt: string;
}

// ETF holdings/orders are tracked separately from the GOLD/SILVER/FIAT
// wallet ledger above rather than widening Transaction/Asset to an open
// set of tickers — an ETF buy still debits the FIAT balance via
// adjustBalance, but its own record lives here. See modules/etfs.
export interface EtfHolding {
  userId: string;
  ticker: string;
  units: number;
  // Cost basis in USD, running average across buys — used for unrealized
  // gain/loss on the portfolio view.
  avgCostUsd: number;
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

export interface Db {
  users: Map<string, User>;
  usersByEmail: Map<string, string>;
  balances: Map<string, WalletBalance>; // key: `${userId}:${asset}`
  transactions: Transaction[];
  etfHoldings: Map<string, EtfHolding>; // key: `${userId}:${ticker}`
  etfOrders: EtfOrder[];
  etfWatchlists: Map<string, Set<string>>; // key: userId -> tickers
}

export const db: Db = {
  users: new Map(),
  usersByEmail: new Map(),
  balances: new Map(),
  transactions: [],
  etfHoldings: new Map(),
  etfOrders: [],
  etfWatchlists: new Map(),
};

// Bootstrap account so apps/admin is reachable at all on a fresh instance —
// there's no other way to create the first super_admin, since every other
// registration path (auth.routes.ts) defaults new users to "user". This is
// a demo credential for an in-memory store that resets on every restart,
// not a production secret; a real deployment would provision this out of
// band instead of shipping it in source.
db.users.set("usr_bootstrap_admin", {
  id: "usr_bootstrap_admin",
  email: "admin@aurix.com",
  passwordHash: hashPassword("AurixAdmin!2026"),
  fullName: "AURIX Super Admin",
  createdAt: new Date(0).toISOString(),
  kycStatus: "verified",
  role: "super_admin",
});
db.usersByEmail.set("admin@aurix.com", "usr_bootstrap_admin");

export function etfHoldingKey(userId: string, ticker: string): string {
  return `${userId}:${ticker}`;
}

export function balanceKey(userId: string, asset: Asset): string {
  return `${userId}:${asset}`;
}

export function getBalance(userId: string, asset: Asset): WalletBalance {
  const key = balanceKey(userId, asset);
  const existing = db.balances.get(key);
  if (existing) return existing;
  const created: WalletBalance = { userId, asset, balance: 0 };
  db.balances.set(key, created);
  return created;
}

export function adjustBalance(userId: string, asset: Asset, delta: number) {
  const bal = getBalance(userId, asset);
  bal.balance += delta;
  db.balances.set(balanceKey(userId, asset), bal);
  return bal;
}

let idCounter = 1;
export function nextId(prefix: string): string {
  return `${prefix}_${(idCounter++).toString(36)}${Date.now().toString(36)}`;
}
