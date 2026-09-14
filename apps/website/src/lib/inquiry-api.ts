/**
 * Public inquiry submissions for investors / partners / businesses.
 * Tries the PHP endpoint on the live docroot; always mirrors to localStorage
 * so practice/admin UIs can read submissions without a backend.
 */

import { USE_PHP_AUTH } from "@/lib/auth-urls";

export type InquiryKind = "investor" | "partner" | "business" | "contact";

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
  message: string;
  locale?: string;
}

export interface StoredInquiry extends InquiryPayload {
  id: string;
  status: InquiryStatus;
  createdAt: string;
}

const STORAGE_KEY = "aurix_inquiries_v1";

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

  const existing = readLocalInquiries();
  writeLocalInquiries([inquiry, ...existing]);

  const endpoint = inquiryEndpoint();
  if (!endpoint) {
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
