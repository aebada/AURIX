/** Spec §2.2 / §4 / §7.7 / §8 operational catalog — demo data until Prisma is live. */

export const custodians = [
  {
    id: "cus_brinks_london",
    name: "Brink's London (candidate)",
    jurisdiction: "GB",
    lastAuditDate: null as string | null,
    lastAuditReportUrl: null as string | null,
    goldGrams: 0,
    silverGrams: 0,
    zkpStatus: "not_started" as const,
    signed: false,
  },
  {
    id: "cus_malca_zurich",
    name: "Malca-Amit (candidate)",
    jurisdiction: "CH",
    lastAuditDate: null as string | null,
    lastAuditReportUrl: null as string | null,
    goldGrams: 0,
    silverGrams: 0,
    zkpStatus: "not_started" as const,
    signed: false,
  },
];

export const ledgerTxns = [
  {
    id: "txn_demo_1",
    layer: "digital",
    type: "deposit",
    asset: "FIAT",
    amount: 10000,
    status: "settled",
    counterparty: "practice_seed",
    createdAt: "2026-10-01T09:00:00Z",
  },
  {
    id: "txn_demo_2",
    layer: "digital",
    type: "buy",
    asset: "GOLD",
    amount: 1.25,
    status: "practice",
    counterparty: "practice_trade",
    createdAt: "2026-10-02T11:22:00Z",
  },
];

export const partnersDirectory = [
  {
    id: "ptn_jeddah_01",
    businessName: "Jeddah bullion prospect",
    country: "SA",
    city: "Jeddah",
    type: "retail",
    status: "pending",
    commissionTier: "standard",
    insuranceStatus: "unknown",
    locations: 1,
    staff: 0,
  },
  {
    id: "ptn_dubai_01",
    businessName: "Dubai gold souk prospect",
    country: "AE",
    city: "Dubai",
    type: "retail",
    status: "pending",
    commissionTier: "standard",
    insuranceStatus: "unknown",
    locations: 1,
    staff: 0,
  },
];

export const defaultCommissionRules = [
  { id: "rule_default", country: "*", partnerType: "*", customerFeePct: 3.0, flatEur: 5, partnerSharePct: 35, tier: "standard" },
  { id: "rule_sa", country: "SA", partnerType: "retail", customerFeePct: 2.8, flatEur: 6, partnerSharePct: 35, tier: "standard" },
  { id: "rule_eg", country: "EG", partnerType: "retail", customerFeePct: 3.5, flatEur: 4, partnerSharePct: 40, tier: "standard" },
];

export const transfers = [
  {
    id: "xbt_practice_1",
    sender: "practice@aurix.app",
    recipientName: "Fatima A.",
    origin: "SA",
    destination: "EG",
    metal: "gold",
    grams: 5,
    status: "paid",
    partner: "Jeddah bullion prospect",
    aml: "clear",
    createdAt: "2026-10-02T08:00:00Z",
  },
];

export const amlCases = [
  {
    id: "aml_1",
    transferId: "xbt_practice_1",
    flagType: "velocity",
    provider: "manual",
    status: "open",
    notes: "Practice seed — no live screening vendor.",
  },
];

export const disputes = [
  {
    id: "dsp_1",
    transferId: "xbt_practice_1",
    raisedBy: "partner",
    reason: "Name mismatch at counter (practice)",
    status: "open",
    createdAt: "2026-10-03T14:00:00Z",
  },
];

export const defaultPayrollThresholds = [
  { id: "th_de_2026_m", country: "DE", taxYear: 2026, planType: "monthly", limitValue: 50, currency: "EUR", effectiveFrom: "2026-01-01" },
  { id: "th_de_2026_a", country: "DE", taxYear: 2026, planType: "annual", limitValue: 10000, currency: "EUR", effectiveFrom: "2026-01-01" },
  { id: "th_at_2026_m", country: "AT", taxYear: 2026, planType: "monthly", limitValue: 50, currency: "EUR", effectiveFrom: "2026-01-01" },
  { id: "th_at_2026_a", country: "AT", taxYear: 2026, planType: "annual", limitValue: 10000, currency: "EUR", effectiveFrom: "2026-01-01" },
];

export const webhookLogs = [
  {
    id: "wh_1",
    source: "stripe",
    event: "not_configured",
    status: "skipped",
    at: "2026-10-04T17:00:00Z",
    note: "No STRIPE_SECRET_KEY on AURIX live env at last check.",
  },
  {
    id: "wh_2",
    source: "paypal",
    event: "not_configured",
    status: "skipped",
    at: "2026-10-04T17:00:00Z",
    note: "No PAYPAL_CLIENT_ID on AURIX live env at last check.",
  },
];

export const maskedApiKeys = [
  { id: "stripe_pk", label: "Stripe publishable", value: "not set on this admin host", set: false },
  { id: "stripe_sk", label: "Stripe secret", value: "••••", set: false },
  { id: "paypal_id", label: "PayPal client id", value: "not set on this admin host", set: false },
  { id: "metals", label: "Metals price API", value: "gold-api.com (no key)", set: true },
];

export const contentDrafts = {
  landingHero: "Gold you can send. Value employees can own.",
  complianceBlurb: "No live custody claims until a signed vault agreement and audit exist.",
  payrollDisclaimer:
    "AURIX provides tools to help administer this benefit. We are not your tax advisor.",
};

export function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveJson(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value));
}
