"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_COMMISSION_RULES,
  DEFAULT_CROSS_BORDER_LIVE,
  SEED_LOCATIONS,
} from "./seed";
import type {
  CommissionRule,
  CountryCode,
  CrossBorderTransfer,
  Fulfillment,
  GoldServiceState,
  MetalType,
  PartnerApplication,
  PartnerLocation,
  PartnerStatus,
  TransferStatus,
} from "./types";

const STORAGE_KEY = "aurix.gold.service.v1";
const CHANGE_EVENT = "aurix-gold-service-change";

const GOLD_EUR_PER_G = 80;
const SILVER_EUR_PER_G = 0.95;

function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function defaultState(): GoldServiceState {
  return {
    locations: SEED_LOCATIONS,
    transfers: [],
    applications: [],
    commissionRules: DEFAULT_COMMISSION_RULES,
    crossBorderLive: { ...DEFAULT_CROSS_BORDER_LIVE },
    reserveLive: false,
    partnerSession: false,
  };
}

function readState(): GoldServiceState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const s = defaultState();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
      return s;
    }
    const parsed = JSON.parse(raw) as GoldServiceState;
    // Merge any new seed locations by id without wiping user data
    const known = new Set(parsed.locations.map((l) => l.id));
    const merged = [
      ...parsed.locations,
      ...SEED_LOCATIONS.filter((l) => !known.has(l.id)),
    ];
    return {
      ...defaultState(),
      ...parsed,
      locations: merged,
      crossBorderLive: {
        ...DEFAULT_CROSS_BORDER_LIVE,
        ...(parsed.crossBorderLive || {}),
      },
      reserveLive: false, // never auto-enable
    };
  } catch {
    return defaultState();
  }
}

function writeState(s: GoldServiceState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function pickRule(
  rules: CommissionRule[],
  country: CountryCode,
): CommissionRule {
  return (
    rules.find((r) => r.country === country) ||
    rules.find((r) => r.country === "*") ||
    DEFAULT_COMMISSION_RULES[0]
  );
}

export function estimateFees(
  metal: MetalType,
  grams: number,
  dest: CountryCode,
  rules: CommissionRule[],
) {
  const price = metal === "gold" ? GOLD_EUR_PER_G : SILVER_EUR_PER_G;
  const metalCost = Math.round(price * grams * 100) / 100;
  const rule = pickRule(rules, dest);
  const serviceFee =
    Math.round(metalCost * (rule.customerFeePct / 100) * 100) / 100;
  const partnerFee = rule.partnerFlat;
  const fxSpread = Math.round(metalCost * 0.004 * 100) / 100;
  const total =
    Math.round((metalCost + serviceFee + partnerFee + fxSpread) * 100) / 100;
  return {
    metalCost,
    serviceFee,
    partnerFee,
    fxSpread,
    total,
    currency: "EUR",
    partnerSharePct: rule.partnerSharePct,
  };
}

type GoldServiceApi = {
  state: GoldServiceState;
  locations: PartnerLocation[];
  filterLocations: (opts: {
    country?: CountryCode | "";
    city?: string;
    q?: string;
    pickup?: boolean;
    delivery?: boolean;
    gold?: boolean;
    silver?: boolean;
  }) => PartnerLocation[];
  getLocation: (id: string) => PartnerLocation | undefined;
  createTransfer: (input: {
    metal: MetalType;
    grams: number;
    fulfillment: Fulfillment;
    originCountry: CountryCode;
    destinationCountry: CountryCode;
    locationId: string;
    recipientName: string;
    recipientPhone: string;
    recipientEmail: string;
    recipientIdType: string;
    relationship: string;
  }) => CrossBorderTransfer;
  getTransfer: (id: string) => CrossBorderTransfer | undefined;
  advanceTransfer: (id: string, status: TransferStatus) => void;
  cancelTransfer: (id: string) => void;
  redeemTransfer: (
    code: string,
    presentedName: string,
  ) => { ok: boolean; message: string; transfer?: CrossBorderTransfer; commission?: number };
  submitApplication: (
    app: Omit<PartnerApplication, "id" | "status" | "createdAt">,
  ) => PartnerApplication;
  setPartnerSession: (v: boolean) => void;
  markInvited: (locationId: string) => void;
  setCorridorLive: (key: string, live: boolean) => void;
  resetDemo: () => void;
};

const Ctx = createContext<GoldServiceApi | null>(null);

export function GoldServiceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GoldServiceState>(defaultState);

  useEffect(() => {
    setState(readState());
    const onChange = () => setState(readState());
    window.addEventListener(CHANGE_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(CHANGE_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const commit = useCallback((next: GoldServiceState) => {
    writeState(next);
    setState(next);
  }, []);

  const api = useMemo<GoldServiceApi>(() => {
    const filterLocations: GoldServiceApi["filterLocations"] = (opts) => {
      return state.locations.filter((l) => {
        if (opts.country && l.country !== opts.country) return false;
        if (opts.city && !l.city.toLowerCase().includes(opts.city.toLowerCase()))
          return false;
        if (opts.q) {
          const q = opts.q.toLowerCase();
          if (
            !l.name.toLowerCase().includes(q) &&
            !l.city.toLowerCase().includes(q) &&
            !l.address.toLowerCase().includes(q)
          )
            return false;
        }
        if (opts.pickup && !l.services.includes("pickup")) return false;
        if (opts.delivery && !l.services.includes("delivery")) return false;
        if (opts.gold && !l.services.includes("gold")) return false;
        if (opts.silver && !l.services.includes("silver")) return false;
        return true;
      });
    };

    return {
      state,
      locations: state.locations,
      filterLocations,
      getLocation: (id) => state.locations.find((l) => l.id === id),
      createTransfer: (input) => {
        const loc = state.locations.find((l) => l.id === input.locationId);
        const fees = estimateFees(
          input.metal,
          input.grams,
          input.destinationCountry,
          state.commissionRules,
        );
        const corridor = `${input.originCountry}-${input.destinationCountry}`;
        const corridorLive = Boolean(state.crossBorderLive[corridor]);
        const now = new Date().toISOString();
        const transfer: CrossBorderTransfer = {
          id: uid("xfer"),
          metal: input.metal,
          grams: input.grams,
          fulfillment: input.fulfillment,
          originCountry: input.originCountry,
          destinationCountry: input.destinationCountry,
          locationId: input.locationId,
          locationName: loc?.name || "Partner location",
          recipientName: input.recipientName,
          recipientPhone: input.recipientPhone,
          recipientEmail: input.recipientEmail,
          recipientIdType: input.recipientIdType,
          relationship: input.relationship,
          feeBreakdown: {
            metalCost: fees.metalCost,
            serviceFee: fees.serviceFee,
            partnerFee: fees.partnerFee,
            fxSpread: fees.fxSpread,
            total: fees.total,
            currency: fees.currency,
          },
          status: "paid",
          statusHistory: [{ status: "paid", at: now }],
          practiceCode: `AX-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
          corridorLive,
          createdAt: now,
        };
        commit({ ...state, transfers: [transfer, ...state.transfers] });
        return transfer;
      },
      getTransfer: (id) => state.transfers.find((t) => t.id === id),
      advanceTransfer: (id, status) => {
        const transfers = state.transfers.map((t) => {
          if (t.id !== id) return t;
          return {
            ...t,
            status,
            statusHistory: [
              ...t.statusHistory,
              { status, at: new Date().toISOString() },
            ],
            completedAt:
              status === "completed" ? new Date().toISOString() : t.completedAt,
          };
        });
        commit({ ...state, transfers });
      },
      cancelTransfer: (id) => {
        const transfers = state.transfers.map((t) => {
          if (t.id !== id) return t;
          if (["completed", "cancelled", "refunded"].includes(t.status)) return t;
          if (["verified", "ready", "out_for_delivery"].includes(t.status))
            return t;
          return {
            ...t,
            status: "cancelled" as const,
            statusHistory: [
              ...t.statusHistory,
              { status: "cancelled" as const, at: new Date().toISOString() },
            ],
          };
        });
        commit({ ...state, transfers });
      },
      redeemTransfer: (code, presentedName) => {
        const transfer = state.transfers.find(
          (t) => t.practiceCode.toLowerCase() === code.trim().toLowerCase(),
        );
        if (!transfer) return { ok: false, message: "Code not found" };
        if (["completed", "cancelled", "refunded"].includes(transfer.status)) {
          return { ok: false, message: `Transfer already ${transfer.status}` };
        }
        const match =
          presentedName.trim().toLowerCase() ===
          transfer.recipientName.trim().toLowerCase();
        if (!match) {
          return {
            ok: false,
            message:
              "Name mismatch — government ID name must match the recipient on the transfer.",
            transfer,
          };
        }
        const fees = estimateFees(
          transfer.metal,
          transfer.grams,
          transfer.destinationCountry,
          state.commissionRules,
        );
        const commission =
          Math.max(
            fees.partnerFee,
            Math.round(fees.serviceFee * (fees.partnerSharePct / 100) * 100) /
              100,
          );
        const now = new Date().toISOString();
        const transfers = state.transfers.map((t) =>
          t.id === transfer.id
            ? {
                ...t,
                status: "completed" as const,
                statusHistory: [
                  ...t.statusHistory,
                  { status: "verified" as const, at: now },
                  { status: "completed" as const, at: now },
                ],
                completedAt: now,
              }
            : t,
        );
        commit({ ...state, transfers });
        return {
          ok: true,
          message: "Redemption completed (practice).",
          transfer: transfers.find((t) => t.id === transfer.id),
          commission,
        };
      },
      submitApplication: (app) => {
        const row: PartnerApplication = {
          ...app,
          id: uid("app"),
          status: "submitted",
          createdAt: new Date().toISOString(),
        };
        commit({ ...state, applications: [row, ...state.applications] });
        return row;
      },
      setPartnerSession: (v) => commit({ ...state, partnerSession: v }),
      markInvited: (locationId) => {
        const locations = state.locations.map((l) =>
          l.id === locationId
            ? { ...l, status: "invited" as PartnerStatus }
            : l,
        );
        commit({ ...state, locations });
      },
      setCorridorLive: (key, live) => {
        commit({
          ...state,
          crossBorderLive: { ...state.crossBorderLive, [key]: live },
        });
      },
      resetDemo: () => commit(defaultState()),
    };
  }, [state, commit]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useGoldService() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useGoldService requires GoldServiceProvider");
  return ctx;
}

/** Optional hook when provider may be absent (marketing pages wrap themselves). */
export function useGoldServiceOptional() {
  return useContext(Ctx);
}
