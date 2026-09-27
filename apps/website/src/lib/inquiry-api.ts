/**
 * Public inquiry / waitlist submissions.
 * Tries backend `/public/*` or PHP endpoint when configured; always mirrors
 * to localStorage so practice/admin UIs work without a hosted API.
 */

import { USE_PHP_AUTH } from "@/lib/auth-urls";

export type InquiryKind = "investor" | "partner" | "business" | "contact" | "waitlist";

export type InquiryStatus = "new" | "contacted" | "in_diligence" | "closed";

export type PartnerVertical = "banks" | "payments" | "investments" | "partners" | "other";

export interface InquiryPayload {
  kind: InquiryKind;
  name: string;
  email: string;
  organization?: string;
  role?: string;
  vertical?: PartnerVertical;
  ticketSize?: string;
  investorType?: string;
  roleTitle?: string;
  interests?: string[];
  hearAbout?: string;
  country?: string;
  phone?: string;
  referral?: string;
  message: string;
  locale?: string;
  /** Honeypot — must stay empty */
  website?: string;
}

export interface StoredInquiry extends InquiryPayload {
  id: string;
  status: InquiryStatus;
  createdAt: string;
}

const STORAGE_KEY = "aurix_inquiries_v1";
const WAITLIST_KEY = "aurix_waitlist_v1";

function apiBase(): string | null {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  return null;
}

function inquiryEndpoint(): string | null {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_INQUIRY_API_URL) {
    return process.env.NEXT_PUBLIC_INQUIRY_API_URL;
  }
  if (USE_PHP_AUTH) return "/auth/investor-inquiry.php";
  return null;
}

export function readLocalInquiries(): StoredInquiry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredInquiry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalInquiries(items: StoredInquiry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 200)));
}

export function readLocalWaitlist(): StoredInquiry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(WAITLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredInquiry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalWaitlist(items: StoredInquiry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(WAITLIST_KEY, JSON.stringify(items.slice(0, 200)));
}

export function updateLocalInquiryStatus(id: string, status: InquiryStatus) {
  const items = readLocalInquiries().map((item) =>
    item.id === id ? { ...item, status } : item,
  );
  writeLocalInquiries(items);
  return items;
}

export async function submitInquiry(
  payload: InquiryPayload,
): Promise<{ ok: boolean; inquiry: StoredInquiry; persistedRemote: boolean }> {
  const inquiry: StoredInquiry = {
    ...payload,
    id: `inq_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    status: "new",
    createdAt: new Date().toISOString(),
  };

  if (payload.kind === "waitlist") {
    writeLocalWaitlist([inquiry, ...readLocalWaitlist()]);
  } else {
    writeLocalInquiries([inquiry, ...readLocalInquiries()]);
  }

  // Prefer dedicated backend public routes when API URL is set.
  const base = apiBase();
  if (base && payload.kind === "waitlist") {
    try {
      const res = await fetch(`${base}/public/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          country: payload.country,
          phone: payload.phone,
          interests: payload.interests ?? [],
          referral: payload.referral,
          locale: payload.locale,
          website: payload.website ?? "",
        }),
      });
      if (res.ok) return { ok: true, inquiry, persistedRemote: true };
    } catch {
      /* fall through */
    }
  }

  if (base && payload.kind === "investor") {
    try {
      const res = await fetch(`${base}/public/investors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: payload.name,
          firm: payload.organization,
          email: payload.email,
          roleTitle: payload.roleTitle,
          investorType: payload.investorType,
          checkSize: payload.ticketSize,
          interests: payload.interests ?? [],
          message: payload.message,
          hearAbout: payload.hearAbout,
          website: payload.website ?? "",
        }),
      });
      if (res.ok) return { ok: true, inquiry, persistedRemote: true };
    } catch {
      /* fall through */
    }
  }

  const endpoint = inquiryEndpoint();
  if (!endpoint) {
    console.log("[inquiry:local]", payload.kind, inquiry.id, inquiry.email);
    return { ok: true, inquiry, persistedRemote: false };
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inquiry),
    });
    if (!res.ok) {
      return { ok: true, inquiry, persistedRemote: false };
    }
    return { ok: true, inquiry, persistedRemote: true };
  } catch {
    return { ok: true, inquiry, persistedRemote: false };
  }
}
