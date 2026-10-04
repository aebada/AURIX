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

export type Role =
  | "user"
  | "support"
  | "admin"
  | "super_admin"
  | "operations_manager"
  | "sales_partnerships"
  | "finance"
  | "marketing"
  | "compliance_officer"
  | "partner"
  | "investor"
  | "employer";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  kycStatus: "unverified" | "pending" | "verified" | "rejected";
  role: Role;
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
  role: Role;
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
  setRole: (token: string, userId: string, role: Role) =>
    request<{ id: string; role: Role }>(
      `/admin/users/${userId}/role`,
      { method: "POST", body: JSON.stringify({ role }) },
      token,
    ),
  waitlist: (token: string) =>
    request<{ entries: WaitlistEntry[] }>("/admin/waitlist", {}, token),
  payrollEmployers: (token: string) =>
    request<{ employers: PayrollEmployerApplication[] }>(
      "/admin/payroll-employers",
      {},
      token,
    ),
  updatePayrollEmployerKyb: (
    token: string,
    id: string,
    kybStatus: PayrollEmployerKybStatus,
    notes?: string,
  ) =>
    request<{ employer: PayrollEmployerApplication }>(
      `/admin/payroll-employers/${id}`,
      { method: "PATCH", body: JSON.stringify({ kybStatus, notes }) },
      token,
    ),
  investors: (token: string) =>
    request<{ inquiries: InvestorInquiry[] }>("/admin/investors", {}, token),
  updateInvestorStatus: (
    token: string,
    id: string,
    status: InvestorPipelineStatus,
    notes?: string,
  ) =>
    request<{ inquiry: InvestorInquiry }>(
      `/admin/investors/${id}`,
      { method: "PATCH", body: JSON.stringify({ status, notes }) },
      token,
    ),
  featureFlags: (token: string) =>
    request<{ flags: FeatureFlagsState }>("/admin/feature-flags", {}, token),
  updateFeatureFlags: (token: string, flags: Partial<FeatureFlagsState>) =>
    request<{ flags: FeatureFlagsState }>(
      "/admin/feature-flags",
      { method: "PUT", body: JSON.stringify(flags) },
      token,
    ),
  metalOrders: (token: string) =>
    request<{ orders: MetalOrder[]; liveMint: boolean; reserveLive: boolean; note: string }>(
      "/admin/metal-orders",
      {},
      token,
    ),
  metalReserves: (token: string) =>
    request<{
      report: {
        asOf: string;
        goldGrams: number;
        silverGrams: number;
        practice: true;
        liveVault: false;
        note: string;
      };
      reserveLive: boolean;
      liveVault: false;
    }>("/admin/metal-orders/reserves", {}, token),
};

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

export interface FeatureFlagsState {
  RESERVE_LIVE: boolean;
  MAINTENANCE_MODE: boolean;
  CROSS_BORDER_LIVE: Record<string, boolean>;
  PAYROLL_BENEFIT_LIVE: { DE: boolean; AT: boolean };
}

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
  liveMint: false;
  practice: true;
  note: string;
  createdAt: string;
  updatedAt: string;
}
