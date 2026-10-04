import { db, nextId } from "../../data/mock-db.js";
import type { PreciousMetal } from "../price/types.js";
import type {
  AllocationResult,
  CustodyProvider,
  RedeemResult,
  ReserveReport,
} from "./types.js";

const PRACTICE_NOTE =
  "Practice custody stub only — not a live vault, allocated bar list, or redeemable metal.";

const allocations = new Map<string, AllocationResult>();

export const mockCustodyProvider: CustodyProvider = {
  id: "mock",

  async allocate(grams: number, metal: PreciousMetal = "gold") {
    if (!(grams > 0)) {
      throw new Error("grams must be positive");
    }
    const row: AllocationResult = {
      id: nextId("alloc"),
      grams,
      metal,
      status: "pending",
      practice: true,
      liveVault: false,
      createdAt: new Date().toISOString(),
      note: PRACTICE_NOTE,
    };
    allocations.set(row.id, row);
    return row;
  },

  async confirmAllocation(id: string) {
    const existing = allocations.get(id);
    if (!existing) {
      throw new Error(`practice allocation not found: ${id}`);
    }
    const next: AllocationResult = {
      ...existing,
      status: "confirmed",
      confirmedAt: new Date().toISOString(),
      practice: true,
      liveVault: false,
      note: PRACTICE_NOTE,
    };
    allocations.set(id, next);
    return next;
  },

  async reportReserves() {
    const report: ReserveReport = {
      asOf: new Date().toISOString(),
      goldGrams: 0,
      silverGrams: 0,
      practice: true,
      liveVault: false,
      note: PRACTICE_NOTE,
    };
    return report;
  },

  async redeem(grams: number, metal: PreciousMetal = "gold"): Promise<RedeemResult> {
    if (!(grams > 0)) {
      throw new Error("grams must be positive");
    }
    // Live redeem is refused while RESERVE_LIVE is off (and this adapter
    // never talks to a vault even if the flag is flipped in admin).
    return {
      id: nextId("redeem"),
      grams,
      metal,
      practice: true,
      liveVault: false,
      refused: true,
      note: db.featureFlags.RESERVE_LIVE
        ? "RESERVE_LIVE is on in mock flags but this adapter still refuses live redeem — no vault partner is wired."
        : "RESERVE_LIVE=false — live redeem is gated. Practice redeem is not vault delivery.",
    };
  },
};
