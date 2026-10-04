/**
 * Partner vault / allocated-platform adapter.
 *
 * Live allocate / redeem / mint stay gated on signed custody + RESERVE_LIVE.
 * Mock implementations must set liveVault: false and never imply a London vault.
 */

import type { PreciousMetal } from "../price/types.js";

export type AllocationStatus = "pending" | "confirmed" | "rejected";

export interface AllocationResult {
  id: string;
  grams: number;
  metal: PreciousMetal;
  status: AllocationStatus;
  practice: true;
  liveVault: false;
  createdAt: string;
  confirmedAt?: string;
  note: string;
}

export interface ReserveReport {
  asOf: string;
  goldGrams: number;
  silverGrams: number;
  practice: true;
  liveVault: false;
  note: string;
}

export interface RedeemResult {
  id: string;
  grams: number;
  metal: PreciousMetal;
  practice: true;
  liveVault: false;
  refused: boolean;
  note: string;
}

export interface CustodyProvider {
  readonly id: string;
  allocate(grams: number, metal?: PreciousMetal): Promise<AllocationResult>;
  confirmAllocation(id: string): Promise<AllocationResult>;
  reportReserves(): Promise<ReserveReport>;
  redeem(grams: number, metal?: PreciousMetal): Promise<RedeemResult>;
}
