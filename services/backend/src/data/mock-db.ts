// In-memory mock data store.
//
// AURIX never custodies assets directly (see docs/PRODUCT_PLAN.md section 5
// and docs/MOBILE_UX.md). In production, wallet balances here would be a
// reconciled *view* of partner systems (vaults, payment processors,
// brokers), not the source of truth. This mock store simulates that shape
// so the API surface is realistic, without any real provider integration.

import { hashPassword } from "../lib/password.js";
import { roleForEmail, type Role } from "../lib/rbac.js";

export type { Role };
export type Asset = "GOLD" | "SILVER" | "FIAT";

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

export type InvestorPipelineStatus = "new" | "contacted" | "in_diligence" | "closed";

export interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  country: string;
  phone?: string;
  interests: string[];
  referral?: string;
  locale?: string;
  createdAt: string;
}

export interface InvestorInquiry {
  id: string;
  name: string;
  firm?: string;
  email: string;
  roleTitle?: string;
  investorType?: string;
  checkSize?: string;
  interests: string[];
  message: string;
  hearAbout?: string;
  status: InvestorPipelineStatus;
  assignedTo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type PayrollEmployerKybStatus = "pending" | "approved" | "rejected";

export interface PayrollEmployerApplication {
  id: string;
  companyLegalName: string;
  registrationNumber: string;
  country: "DE" | "AT";
  address: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  employeeCount: string;
  industry?: string;
  locale?: string;
  kybStatus: PayrollEmployerKybStatus;
  additionalityAttested: boolean;
  additionalityAttestedAt: string;
  additionalityAttestedBy: string;
  additionalityAttestedIp?: string;
  privacyConsent: boolean;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface AdminAuditLog {
  id: string;
  actorId?: string;
  action: string;
  targetType?: string;
  targetId?: string;
  previousValue?: string;
  newValue?: string;
  createdAt: string;
}

export interface FeatureFlagsState {
  RESERVE_LIVE: boolean;
  MAINTENANCE_MODE: boolean;
  CROSS_BORDER_LIVE: Record<string, boolean>;
  PAYROLL_BENEFIT_LIVE: { DE: boolean; AT: boolean };
}

/** London connector order machine (Phase A stub). Live mint stays off. */
export type MetalOrderStatus =
  | "quoted"
  | "paid"
  | "allocated"
  | "minted"
  | "settled"
  | "cancelled"
  | "failed";

export interface MetalOrder {
  id: string;
  userId?: string;
  metal: "gold" | "silver";
  grams: number;
  fiatAmount: number;
  fiatCurrency: "EUR" | "USD";
  status: MetalOrderStatus;
  quoteId?: string;
  custodyAllocationId?: string;
  /** Always false in this stub — real mint is Phase C + RESERVE_LIVE. */
  liveMint: false;
  practice: true;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface Db {
  users: Map<string, User>;
  usersByEmail: Map<string, string>;
  balances: Map<string, WalletBalance>; // key: `${userId}:${asset}`
  transactions: Transaction[];
  etfHoldings: Map<string, EtfHolding>; // key: `${userId}:${ticker}`
  etfOrders: EtfOrder[];
  etfWatchlists: Map<string, Set<string>>; // key: userId -> tickers
  waitlist: WaitlistEntry[];
  investorInquiries: InvestorInquiry[];
  payrollEmployers: PayrollEmployerApplication[];
  adminAuditLogs: AdminAuditLog[];
  featureFlags: FeatureFlagsState;
  metalOrders: MetalOrder[];
}

export const db: Db = {
  users: new Map(),
  usersByEmail: new Map(),
  balances: new Map(),
  transactions: [],
  etfHoldings: new Map(),
  etfOrders: [],
  etfWatchlists: new Map(),
  waitlist: [],
  investorInquiries: [],
  payrollEmployers: [],
  adminAuditLogs: [],
  featureFlags: {
    RESERVE_LIVE: false,
    MAINTENANCE_MODE: false,
    CROSS_BORDER_LIVE: {
      "SA-EG": false,
      "AE-EG": false,
      "KW-EG": false,
      "QA-EG": false,
      "AE-SA": false,
      "SA-AE": false,
    },
    PAYROLL_BENEFIT_LIVE: { DE: false, AT: false },
  },
  metalOrders: [],
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

// Spec seed (Section 4): application-level super_admin for the founder email.
// Same demo password pattern as bootstrap — local mock only; not a production secret.
db.users.set("usr_seed_super_admin", {
  id: "usr_seed_super_admin",
  email: "engahmed2055@gmail.com",
  passwordHash: hashPassword("AurixAdmin!2026"),
  fullName: "Ahmed",
  createdAt: new Date(0).toISOString(),
  kycStatus: "verified",
  role: "super_admin",
});
db.usersByEmail.set("engahmed2055@gmail.com", "usr_seed_super_admin");

export function appendAuditLog(
  entry: Omit<AdminAuditLog, "id" | "createdAt"> & { id?: string; createdAt?: string },
) {
  const row: AdminAuditLog = {
    id: entry.id ?? nextId("audit"),
    actorId: entry.actorId,
    action: entry.action,
    targetType: entry.targetType,
    targetId: entry.targetId,
    previousValue: entry.previousValue,
    newValue: entry.newValue,
    createdAt: entry.createdAt ?? new Date().toISOString(),
  };
  db.adminAuditLogs.unshift(row);
  return row;
}

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

const ORDER_NOTE =
  "Practice metal order — not a live vault allocation or BPC mint.";

function seedMetalOrder(
  status: MetalOrderStatus,
  grams: number,
  extras: Partial<MetalOrder> = {},
): MetalOrder {
  const now = new Date().toISOString();
  return {
    id: nextId("mord"),
    metal: "gold",
    grams,
    fiatAmount: Number((grams * 80).toFixed(2)),
    fiatCurrency: "EUR",
    status,
    liveMint: false,
    practice: true,
    note: ORDER_NOTE,
    createdAt: now,
    updatedAt: now,
    ...extras,
  };
}

db.metalOrders.push(
  seedMetalOrder("quoted", 1, { quoteId: "quote_practice_1" }),
  seedMetalOrder("paid", 2.5, { quoteId: "quote_practice_2" }),
  seedMetalOrder("allocated", 5, {
    quoteId: "quote_practice_3",
    custodyAllocationId: "alloc_practice_demo",
  }),
  seedMetalOrder("cancelled", 0.5, { quoteId: "quote_practice_4" }),
);

const LIVE_MINT_STATUSES: MetalOrderStatus[] = ["minted", "settled"];

export function assertPracticeMintGated(nextStatus: MetalOrderStatus) {
  if (LIVE_MINT_STATUSES.includes(nextStatus) && !db.featureFlags.RESERVE_LIVE) {
    throw new Error("mint/settle is gated while RESERVE_LIVE=false");
  }
  // Even with the flag on, this stub never performs a live mint.
  if (LIVE_MINT_STATUSES.includes(nextStatus)) {
    throw new Error("live mint is not implemented — no custody partner is wired");
  }
}

export function createMetalOrder(input: {
  userId: string;
  metal: "gold" | "silver";
  grams: number;
  fiatAmount: number;
  fiatCurrency: "EUR" | "USD";
  quoteId?: string;
}): MetalOrder {
  const now = new Date().toISOString();
  const order: MetalOrder = {
    id: nextId("mord"),
    userId: input.userId,
    metal: input.metal,
    grams: input.grams,
    fiatAmount: input.fiatAmount,
    fiatCurrency: input.fiatCurrency,
    status: "quoted",
    quoteId: input.quoteId,
    liveMint: false,
    practice: true,
    note: ORDER_NOTE,
    createdAt: now,
    updatedAt: now,
  };
  db.metalOrders.unshift(order);
  return order;
}

export function updateMetalOrder(
  id: string,
  patch: Partial<Pick<MetalOrder, "status" | "custodyAllocationId" | "note" | "quoteId">>,
): MetalOrder {
  const order = db.metalOrders.find((o) => o.id === id);
  if (!order) throw new Error("Metal order not found");
  if (patch.status) assertPracticeMintGated(patch.status);
  Object.assign(order, patch, { updatedAt: new Date().toISOString(), liveMint: false, practice: true });
  return order;
}
