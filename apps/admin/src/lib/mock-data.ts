// Mock data only — this app is not yet wired up to services/backend or
// services/ai, and has no real authentication/authorization.

export const opsSummary = {
  totalUsers: 4821,
  pendingKyc: 12,
  flaggedTransactions: 3,
  reserveStatus: "Matched" as const,
};

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  kycStatus: "unverified" | "pending" | "verified" | "rejected";
  createdAt: string;
}

export const users: AdminUser[] = [
  { id: "usr_1", email: "alice@example.com", fullName: "Alice Chen", kycStatus: "verified", createdAt: "2026-03-11" },
  { id: "usr_2", email: "bob@example.com", fullName: "Bob Iyer", kycStatus: "pending", createdAt: "2026-05-02" },
  { id: "usr_3", email: "sara@example.com", fullName: "Sara Musa", kycStatus: "verified", createdAt: "2026-04-19" },
  { id: "usr_4", email: "tom@example.com", fullName: "Tom Reyes", kycStatus: "rejected", createdAt: "2026-06-08" },
];

export const kycQueue = users.filter((u) => u.kycStatus === "pending");

export interface FlaggedTransaction {
  id: string;
  user: string;
  reason: string;
  riskScore: number;
  amount: string;
}

export const flaggedTransactions: FlaggedTransaction[] = [
  { id: "txn_9", user: "bob@example.com", reason: "Amount exceeds typical threshold", riskScore: 0.72, amount: "$9,800.00" },
  { id: "txn_14", user: "unknown@example.com", reason: "First transaction to new recipient + high velocity", riskScore: 0.81, amount: "$4,200.00" },
  { id: "txn_21", user: "tom@example.com", reason: "Rejected KYC attempting transaction", riskScore: 0.95, amount: "$1,000.00" },
];

export interface PartnerHealth {
  name: string;
  category: string;
  status: "Operational" | "Degraded" | "Down";
  lastChecked: string;
}

export const partnerHealth: PartnerHealth[] = [
  { name: "BullionVault", category: "Vault Provider", status: "Operational", lastChecked: "2 min ago" },
  { name: "Stripe", category: "Payment Provider", status: "Operational", lastChecked: "2 min ago" },
  { name: "LBMA Pricing Feed", category: "Market Data", status: "Degraded", lastChecked: "5 min ago" },
  { name: "SumSub", category: "KYC / Compliance", status: "Operational", lastChecked: "1 min ago" },
];

export interface GovernanceProposal {
  id: string;
  title: string;
  aiRecommendation: string;
  aiScore: number;
  requiresHumanApproval: true;
  status: "Awaiting review" | "Approved" | "Rejected";
}

export const governanceProposals: GovernanceProposal[] = [
  {
    id: "gov_1",
    title: "Lower gold spread from 0.5% to 0.4% for Premium tier",
    aiRecommendation: "Favorable, standard review",
    aiScore: 0.68,
    requiresHumanApproval: true,
    status: "Awaiting review",
  },
  {
    id: "gov_2",
    title: "Raise daily transfer limit for verified users",
    aiRecommendation: "Needs additional scrutiny before a vote",
    aiScore: 0.41,
    requiresHumanApproval: true,
    status: "Awaiting review",
  },
];
