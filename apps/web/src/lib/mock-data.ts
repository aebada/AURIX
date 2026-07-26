// Mock data only — this app is not yet wired up to services/backend.

export const portfolio = {
  totalUsd: 128_450.32,
  changePctToday: 1.8,
  allocation: [
    { asset: "Gold", pct: 52, colorVar: "--color-gold" },
    { asset: "Silver", pct: 18, colorVar: "--color-navy-soft" },
    { asset: "Fiat", pct: 22, colorVar: "--color-line" },
    { asset: "Crypto (connected)", pct: 8, colorVar: "--color-muted" },
  ],
};

export interface Transaction {
  id: string;
  date: string;
  type: "Buy" | "Sell" | "Transfer" | "Deposit" | "Withdrawal";
  asset: string;
  amount: string;
  status: "Settled" | "Pending" | "Failed";
  reference: string;
}

export const transactions: Transaction[] = [
  { id: "txn_1", date: "2026-07-24", type: "Buy", asset: "Gold", amount: "+120.4 BPC", status: "Settled", reference: "mock-vault-8841" },
  { id: "txn_2", date: "2026-07-23", type: "Transfer", asset: "Fiat", amount: "-$1,250.00", status: "Settled", reference: "internal" },
  { id: "txn_3", date: "2026-07-22", type: "Deposit", asset: "Fiat", amount: "+$5,000.00", status: "Settled", reference: "mock-stripe-2291" },
  { id: "txn_4", date: "2026-07-20", type: "Sell", asset: "Silver", amount: "-800.0 BPC", status: "Pending", reference: "mock-vault-7723" },
  { id: "txn_5", date: "2026-07-18", type: "Withdrawal", asset: "Fiat", amount: "-$2,000.00", status: "Failed", reference: "mock-stripe-1187" },
];

export const statements = [
  { id: "st_2026_06", period: "June 2026", format: "PDF" },
  { id: "st_2026_05", period: "May 2026", format: "PDF" },
  { id: "st_2026_04", period: "April 2026", format: "PDF" },
];

export const businessWallets = [
  { id: "biz_1", name: "AURIX Retail Ops", role: "Owner", balanceUsd: 42_100.0 },
  { id: "biz_2", name: "Payroll Reserve", role: "Viewer", balanceUsd: 18_300.0 },
];

export const apiKeys = [
  { id: "key_1", label: "Production", createdAt: "2026-05-01", lastUsed: "2026-07-25", scopes: "read:wallet, read:transactions" },
  { id: "key_2", label: "Sandbox", createdAt: "2026-04-12", lastUsed: "2026-07-10", scopes: "read:wallet" },
];

export const partnerConnections = [
  { id: "p_1", name: "BullionVault", category: "Vault Provider", status: "Connected" },
  { id: "p_2", name: "Stripe", category: "Payment Provider", status: "Connected" },
  { id: "p_3", name: "LBMA Pricing Feed", category: "Market Data", status: "Connected" },
  { id: "p_4", name: "SumSub", category: "KYC / Compliance", status: "Not connected" },
];
