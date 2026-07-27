// Mock data for the parts of this app with no backend endpoint yet
// (Statements, Business, Partners & API). Overview and Transactions now
// pull live data from services/backend — see src/lib/api.ts.

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
