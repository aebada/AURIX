import type { CommissionRule, PartnerLocation } from "./types";
import prospectsJson from "./prospects-from-csv.json";

/** Embedded fallback if JSON is empty — public prospects only. */
export const SEED_LOCATIONS_FALLBACK: PartnerLocation[] = [
  {
    id: "loc_sa_damas_riyadh",
    partnerId: "p_damas",
    name: "Damas Jewellery — Riyadh Park",
    country: "SA",
    city: "Riyadh",
    type: "chain",
    address: "Riyadh Park Mall, Riyadh",
    lat: 24.7825,
    lng: 46.659,
    website: "https://www.damasjewellery.com/",
    email: "",
    phone: "",
    hours: "10:00–22:00",
    services: ["pickup", "gold", "silver", "buyback"],
    languages: ["ar", "en"],
    status: "prospect",
    verified: false,
    rating: 4.5,
    yearsActive: 40,
    sourceUrl: "https://www.damasjewellery.com/",
    notes: "Regional chain prospect — not an AURIX partner",
  },
  {
    id: "loc_eg_damas_cairo",
    partnerId: "p_damas",
    name: "Damas Jewellery — Cairo Festival City",
    country: "EG",
    city: "Cairo",
    type: "chain",
    address: "Cairo Festival City, New Cairo",
    lat: 30.028,
    lng: 31.408,
    website: "https://www.damasjewellery.com/",
    email: "",
    phone: "",
    hours: "10:00–22:00",
    services: ["pickup", "delivery", "gold", "silver"],
    languages: ["ar", "en"],
    status: "prospect",
    verified: false,
    rating: 4.4,
    yearsActive: 40,
    sourceUrl: "https://www.damasjewellery.com/",
    notes: "Prospect — not an AURIX partner",
  },
];

function normalizeLocation(raw: unknown, index: number): PartnerLocation | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const country = String(r.country || "").toUpperCase();
  if (!["SA", "EG", "KW", "AE", "QA"].includes(country)) return null;
  const name = String(r.name || "").trim();
  if (!name) return null;
  const type = String(r.type || "jewelry");
  const okType = ["jewelry", "bullion", "exchange", "souk", "chain", "agent"].includes(type)
    ? (type as PartnerLocation["type"])
    : "jewelry";
  const servicesRaw = Array.isArray(r.services) ? r.services.map(String) : ["pickup", "gold"];
  const services = servicesRaw.filter((s): s is PartnerLocation["services"][number] =>
    ["pickup", "delivery", "gold", "silver", "buyback"].includes(s),
  );
  return {
    id: String(r.id || `loc_import_${index}`),
    partnerId: String(r.partnerId || `p_import_${index}`),
    name,
    country: country as PartnerLocation["country"],
    city: String(r.city || ""),
    type: okType,
    address: String(r.address || ""),
    lat: typeof r.lat === "number" ? r.lat : null,
    lng: typeof r.lng === "number" ? r.lng : null,
    website: String(r.website || ""),
    email: String(r.email || ""),
    phone: String(r.phone || ""),
    hours: String(r.hours || "10:00–22:00"),
    services: services.length ? services : ["pickup", "gold"],
    languages: Array.isArray(r.languages) ? r.languages.map(String) : ["ar", "en"],
    status: (["prospect", "invited", "pending", "approved", "suspended"].includes(String(r.status))
      ? String(r.status)
      : "prospect") as PartnerLocation["status"],
    verified: Boolean(r.verified) && String(r.status) === "approved",
    rating: typeof r.rating === "number" ? r.rating : 4.2,
    yearsActive: typeof r.yearsActive === "number" ? r.yearsActive : 10,
    sourceUrl: String(r.sourceUrl || r.website || ""),
    notes: String(r.notes || "prospect — not AURIX partner"),
  };
}

const fromJson = (Array.isArray(prospectsJson) ? prospectsJson : [])
  .map(normalizeLocation)
  .filter((x): x is PartnerLocation => x !== null);

/** Public prospect locations — never claim verified partner until status=approved. */
export const SEED_LOCATIONS: PartnerLocation[] =
  fromJson.length > 0 ? fromJson : SEED_LOCATIONS_FALLBACK;

export const DEFAULT_COMMISSION_RULES: CommissionRule[] = [
  {
    id: "rule_default",
    country: "*",
    partnerType: "*",
    customerFeePct: 3.0,
    partnerFlat: 5,
    partnerSharePct: 35,
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "rule_sa",
    country: "SA",
    partnerType: "*",
    customerFeePct: 2.8,
    partnerFlat: 6,
    partnerSharePct: 35,
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "rule_eg",
    country: "EG",
    partnerType: "*",
    customerFeePct: 3.5,
    partnerFlat: 4,
    partnerSharePct: 40,
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

/** All corridors practice-only until licensed settlement. */
export const DEFAULT_CROSS_BORDER_LIVE: Record<string, boolean> = {
  "SA-EG": false,
  "AE-EG": false,
  "KW-EG": false,
  "QA-EG": false,
  "AE-SA": false,
  "SA-AE": false,
  "SA-KW": false,
  "SA-QA": false,
  "EG-SA": false,
  "KW-SA": false,
  "QA-SA": false,
  "AE-KW": false,
  "AE-QA": false,
};
