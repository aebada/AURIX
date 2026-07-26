// Mock data only — this app is not yet wired up to services/backend.
// Shapes intentionally mirror the backend's API (see
// services/backend/src/data/mock-db.ts) so swapping in real network
// calls later is a drop-in replacement.

export type Asset = "GOLD" | "SILVER" | "FIAT";

export interface WalletBalance {
  asset: Asset;
  label: string;
  balance: number;
  displayValue: string;
}

export const wallet: WalletBalance[] = [
  { asset: "GOLD", label: "Gold", balance: 8214, displayValue: "8,214 BPC" },
  { asset: "SILVER", label: "Silver", balance: 3050, displayValue: "3,050 BPC" },
  { asset: "FIAT", label: "Fiat", balance: 1205.1, displayValue: "$1,205.10" },
];

export const totalBalanceUsd = "$12,480.32";
export const totalBalanceChangeToday = "+2.4%";

export interface MockTransaction {
  id: string;
  type: "buy" | "sell" | "transfer" | "deposit";
  label: string;
  asset: Asset;
  amount: string;
  date: string;
}

export const transactions: MockTransaction[] = [
  { id: "t1", type: "buy", label: "Bought Gold", asset: "GOLD", amount: "+120 BPC", date: "Today" },
  { id: "t2", type: "transfer", label: "Sent to Bob", asset: "FIAT", amount: "-$50.00", date: "Today" },
  { id: "t3", type: "deposit", label: "Top-up", asset: "FIAT", amount: "+$500.00", date: "Yesterday" },
  { id: "t4", type: "sell", label: "Sold Silver", asset: "SILVER", amount: "-200 BPC", date: "2 days ago" },
];

export interface MarketPrice {
  symbol: string;
  label: string;
  price: string;
  changePct: number;
}

export const marketPrices: MarketPrice[] = [
  { symbol: "XAU", label: "Gold / gram", price: "$87.41", changePct: 0.6 },
  { symbol: "XAG", label: "Silver / gram", price: "$1.03", changePct: -0.3 },
  { symbol: "BTC", label: "Bitcoin", price: "$68,450", changePct: 1.8 },
  { symbol: "EURUSD", label: "EUR / USD", price: "1.08", changePct: 0.1 },
];

export const savingsGoal = {
  name: "Gold savings goal",
  targetGrams: 50,
  currentGrams: 34,
};

export const profile = {
  fullName: "Alex Founder",
  email: "alex@example.com",
  kycStatus: "verified" as const,
};
