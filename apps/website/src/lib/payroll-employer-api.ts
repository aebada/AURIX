/**
 * Employer company application for AURIX for Payroll (§3.4 / §8.1 starter).
 * Persists via Node `/public/payroll-employers` when API URL is set, else PHP
 * `/auth/payroll-employer-apply.php` (production). localStorage alone is never
 * treated as enough for review — callers must check `persistedRemote`.
 */

import { USE_PHP_AUTH } from "@/lib/auth-urls";

export type PayrollEmployerCountry = "DE" | "AT";

export interface PayrollEmployerApplication {
  companyLegalName: string;
  registrationNumber: string;
  country: PayrollEmployerCountry;
  address: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  employeeCount: string;
  industry?: string;
  additionalityAttested: boolean;
  privacyConsent: boolean;
  locale?: string;
  /** Honeypot — must stay empty */
  website?: string;
}

export interface StoredPayrollEmployerApplication extends PayrollEmployerApplication {
  id: string;
  kybStatus: "pending" | "approved" | "rejected";
  createdAt: string;
  additionalityAttestedAt?: string;
}

function apiBase(): string | null {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  return null;
}

function phpEndpoint(): string | null {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_PAYROLL_APPLY_API_URL) {
    return process.env.NEXT_PUBLIC_PAYROLL_APPLY_API_URL;
  }
  if (USE_PHP_AUTH) return "/auth/payroll-employer-apply.php";
  return null;
}

export async function submitPayrollEmployerApplication(
  payload: PayrollEmployerApplication,
): Promise<{ ok: boolean; id: string; persistedRemote: boolean; error?: string }> {
  if (payload.website && payload.website.trim().length > 0) {
    return { ok: true, id: "honeypot", persistedRemote: true };
  }
  if (!payload.additionalityAttested) {
    return { ok: false, id: "", persistedRemote: false, error: "additionality_required" };
  }
  if (!payload.privacyConsent) {
    return { ok: false, id: "", persistedRemote: false, error: "privacy_required" };
  }

  const body = {
    companyLegalName: payload.companyLegalName.trim(),
    registrationNumber: payload.registrationNumber.trim(),
    country: payload.country,
    address: payload.address.trim(),
    contactName: payload.contactName.trim(),
    contactEmail: payload.contactEmail.trim(),
    contactPhone: payload.contactPhone.trim(),
    employeeCount: payload.employeeCount.trim(),
    industry: payload.industry?.trim() || undefined,
    additionalityAttested: true,
    privacyConsent: true,
    locale: payload.locale,
    website: "",
  };

  const base = apiBase();
  if (base) {
    try {
      const res = await fetch(`${base}/public/payroll-employers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const json = (await res.json()) as { id?: string };
        return { ok: true, id: json.id ?? "ok", persistedRemote: true };
      }
    } catch {
      /* fall through to PHP */
    }
  }

  const endpoint = phpEndpoint();
  if (!endpoint) {
    return {
      ok: false,
      id: "",
      persistedRemote: false,
      error: "no_endpoint",
    };
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      let error = "submit_failed";
      try {
        const errJson = (await res.json()) as { error?: string };
        if (errJson.error) error = errJson.error;
      } catch {
        /* ignore */
      }
      return { ok: false, id: "", persistedRemote: false, error };
    }
    const json = (await res.json()) as { id?: string };
    return { ok: true, id: json.id ?? "ok", persistedRemote: true };
  } catch {
    return { ok: false, id: "", persistedRemote: false, error: "network" };
  }
}
