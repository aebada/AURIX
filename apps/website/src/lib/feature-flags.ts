/**
 * Platform feature flags (Section 0 / Milestone 1).
 *
 * Defaults are OFF / certification. Live custody, remittance settlement,
 * and payroll grants must never auto-enable from client storage alone.
 *
 * Env (all optional; unset = false / empty):
 *   NEXT_PUBLIC_RESERVE_LIVE=0|1|true|false
 *   NEXT_PUBLIC_MAINTENANCE_MODE=0|1|true|false
 *   NEXT_PUBLIC_CROSS_BORDER_LIVE=SA-EG,AE-EG   (comma-separated corridors that are live)
 *   NEXT_PUBLIC_CROSS_BORDER_LIVE_JSON={"SA-EG":false,"AE-EG":false}
 *   NEXT_PUBLIC_PAYROLL_BENEFIT_LIVE=DE,AT      (comma-separated ISO country codes)
 *   NEXT_PUBLIC_PAYROLL_BENEFIT_LIVE_JSON={"DE":false,"AT":false}
 */

export const DEFAULT_CORRIDORS = [
  "SA-EG",
  "AE-EG",
  "KW-EG",
  "QA-EG",
  "AE-SA",
  "SA-AE",
] as const;

export type CorridorCode = (typeof DEFAULT_CORRIDORS)[number] | string;

export const PAYROLL_COUNTRIES = ["DE", "AT"] as const;
export type PayrollCountry = (typeof PAYROLL_COUNTRIES)[number];

function envTruthy(raw: string | undefined): boolean {
  if (!raw) return false;
  const v = raw.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

function parseCsvSet(raw: string | undefined): Set<string> {
  if (!raw?.trim()) return new Set();
  return new Set(
    raw
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean),
  );
}

function parseJsonBoolMap(raw: string | undefined): Record<string, boolean> | null {
  if (!raw?.trim()) return null;
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") return null;
    const out: Record<string, boolean> = {};
    for (const [k, v] of Object.entries(parsed)) {
      out[k.toUpperCase()] = Boolean(v);
    }
    return out;
  } catch {
    return null;
  }
}

function buildCorridorMap(): Record<string, boolean> {
  const fromJson = parseJsonBoolMap(process.env.NEXT_PUBLIC_CROSS_BORDER_LIVE_JSON);
  const fromCsv = parseCsvSet(process.env.NEXT_PUBLIC_CROSS_BORDER_LIVE);
  const map: Record<string, boolean> = {};
  for (const c of DEFAULT_CORRIDORS) {
    map[c] = false;
  }
  if (fromJson) {
    for (const [k, v] of Object.entries(fromJson)) map[k] = v;
  }
  for (const c of fromCsv) map[c] = true;
  return map;
}

function buildPayrollMap(): Record<PayrollCountry, boolean> {
  const fromJson = parseJsonBoolMap(process.env.NEXT_PUBLIC_PAYROLL_BENEFIT_LIVE_JSON);
  const fromCsv = parseCsvSet(process.env.NEXT_PUBLIC_PAYROLL_BENEFIT_LIVE);
  const map = { DE: false, AT: false } as Record<PayrollCountry, boolean>;
  if (fromJson) {
    if ("DE" in fromJson) map.DE = fromJson.DE;
    if ("AT" in fromJson) map.AT = fromJson.AT;
  }
  if (fromCsv.has("DE")) map.DE = true;
  if (fromCsv.has("AT")) map.AT = true;
  return map;
}

/** Snapshot of flags baked at build time for the static site. */
export const featureFlags = {
  reserveLive: envTruthy(process.env.NEXT_PUBLIC_RESERVE_LIVE),
  maintenanceMode: envTruthy(process.env.NEXT_PUBLIC_MAINTENANCE_MODE),
  crossBorderLive: buildCorridorMap(),
  payrollBenefitLive: buildPayrollMap(),
} as const;

export function isReserveLive(): boolean {
  return featureFlags.reserveLive;
}

export function isMaintenanceMode(): boolean {
  return featureFlags.maintenanceMode;
}

export function isCrossBorderLive(corridor: string): boolean {
  const key = corridor.toUpperCase();
  return Boolean(featureFlags.crossBorderLive[key]);
}

export function isPayrollBenefitLive(country: string): boolean {
  const key = country.toUpperCase() as PayrollCountry;
  if (key !== "DE" && key !== "AT") return false;
  return Boolean(featureFlags.payrollBenefitLive[key]);
}

export function anyPayrollLive(): boolean {
  return isPayrollBenefitLive("DE") || isPayrollBenefitLive("AT");
}

export function defaultCrossBorderLiveMap(): Record<string, boolean> {
  return { ...featureFlags.crossBorderLive };
}

export type CertificationKind =
  | "reserve"
  | "cross_border"
  | "payroll"
  | "maintenance";

export function certificationCopy(
  kind: CertificationKind,
  locale: "en" | "de" | "ar" = "en",
): { title: string; body: string } {
  const copy = {
    en: {
      reserve: {
        title: "Coming soon / in certification",
        body: "Live vault custody, mint, and redeem are not enabled. Practice balances are local demos only.",
      },
      cross_border: {
        title: "Corridor in certification",
        body: "Cross-border settlement stays mocked until money-service licensing is confirmed for this corridor.",
      },
      payroll: {
        title: "Payroll benefit coming soon",
        body: "AURIX for Payroll is not live in this country yet. Join the waitlist — we do not grant live gold benefits until certification.",
      },
      maintenance: {
        title: "Maintenance",
        body: "AURIX is temporarily in maintenance mode. Forms and practice flows may be limited.",
      },
    },
    de: {
      reserve: {
        title: "Demnächst / in Zertifizierung",
        body: "Live-Verwahrungs-, Mint- und Redeem-Funktionen sind nicht aktiv. Übungsstände sind nur lokale Demos.",
      },
      cross_border: {
        title: "Korridor in Zertifizierung",
        body: "Grenzüberschreitende Abwicklung bleibt gemockt, bis die Lizenz für diesen Korridor vorliegt.",
      },
      payroll: {
        title: "Lohn-Benefit demnächst",
        body: "AURIX for Payroll ist in diesem Land noch nicht live. Warteliste — keine echten Gold-Grants vor Zertifizierung.",
      },
      maintenance: {
        title: "Wartung",
        body: "AURIX befindet sich vorübergehend im Wartungsmodus.",
      },
    },
    ar: {
      reserve: {
        title: "قريبًا / قيد الاعتماد",
        body: "الحفظ الحي والسك والاسترداد غير مفعّلة. الأرصدة التجريبية محلية فقط.",
      },
      cross_border: {
        title: "الممر قيد الاعتماد",
        body: "التسوية عبر الحدود تبقى تجريبية حتى تأكيد الترخيص لهذا الممر.",
      },
      payroll: {
        title: "ميزة الرواتب قريبًا",
        body: "AURIX للرواتب غير متاحة في هذا البلد بعد. انضم لقائمة الانتظار.",
      },
      maintenance: {
        title: "صيانة",
        body: "AURIX في وضع الصيانة مؤقتًا.",
      },
    },
  } as const;
  return copy[locale][kind];
}
