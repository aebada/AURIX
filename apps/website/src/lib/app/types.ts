/** Multi-wallet product model (Revolut-inspired) for the static /app shell. */

export type WalletKind = "personal" | "business" | "kids" | "savings";

export type BusinessRole = "owner" | "admin" | "finance" | "member" | "viewer";

export type Metal = "gold" | "silver";

export type TxnKind =
  | "buy"
  | "sell"
  | "transfer"
  | "deposit"
  | "voucher"
  | "approve"
  | "invite";

export interface PocketBalances {
  /** Fiat pocket (practice EUR). */
  fiatEur: number;
  goldGrams: number;
  silverGrams: number;
}

export interface Wallet {
  id: string;
  kind: WalletKind;
  name: string;
  /** ISO currency label for display (practice uses EUR). */
  currency: "EUR" | "USD";
  balances: PocketBalances;
  /** Parent wallet id for kids / nested savings. */
  parentId?: string;
  /** Monthly spend limit (kids) in EUR. */
  monthlyLimitEur?: number;
  /** Spent this calendar month (kids). */
  spentThisMonthEur?: number;
  /** Pending spend requests awaiting parent approval. */
  pendingApprovals?: PendingSpend[];
  /** Business-only metadata. */
  business?: {
    companyName: string;
    role: BusinessRole;
    members: TeamMember[];
    invites: TeamInvite[];
  };
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: BusinessRole;
}

export interface TeamInvite {
  id: string;
  email: string;
  role: BusinessRole;
  status: "pending" | "accepted" | "revoked";
  createdAt: string;
}

export interface PendingSpend {
  id: string;
  amountEur: number;
  label: string;
  createdAt: string;
  status: "pending" | "approved" | "denied";
}

export interface AppTxn {
  id: string;
  walletId: string;
  kind: TxnKind;
  label: string;
  amountLabel: string;
  createdAt: string;
}

export type VoucherStatus = "active" | "redeemed" | "gifted";

export interface Voucher {
  id: string;
  code: string;
  amountEur: number;
  status: VoucherStatus;
  /** Wallet that created / funded it. */
  fromWalletId: string;
  /** Optional gift recipient label. */
  giftTo?: string;
  redeemedIntoWalletId?: string;
  createdAt: string;
  note?: string;
}

export interface PracticeState {
  practiceEnabled: boolean;
  activeWalletId: string;
  wallets: Wallet[];
  transactions: AppTxn[];
  vouchers: Voucher[];
}

export const PRACTICE_PRICES = {
  goldEurPerGram: 80,
  silverEurPerGram: 0.95,
  feeRate: 0.005,
} as const;
