import { mockCustodyProvider } from "./mock-custody-provider.js";
import type { CustodyProvider } from "./types.js";

export type {
  AllocationResult,
  AllocationStatus,
  CustodyProvider,
  RedeemResult,
  ReserveReport,
} from "./types.js";
export { mockCustodyProvider } from "./mock-custody-provider.js";

const UNSIGNED_NOTE =
  "No signed allocated-platform or London vault agreement is wired. Live BullionVault / Goldmoney / Brink’s adapters are not enabled.";

/**
 * Named Phase B placeholder. Same practice behaviour as mock — never
 * calls a vendor. Flip only after a signed custody contract.
 */
export const unsignedAllocatedPlatformStub: CustodyProvider = {
  ...mockCustodyProvider,
  id: "unsigned_allocated_platform_stub",
  async redeem(grams, metal) {
    const result = await mockCustodyProvider.redeem(grams, metal);
    return { ...result, note: UNSIGNED_NOTE };
  },
};

/**
 * First real adapter (BullionVault / Goldmoney / vault EDI) replaces the
 * mock only after a signed agreement — not before RESERVE_LIVE certification.
 */
export function getCustodyProvider(): CustodyProvider {
  return mockCustodyProvider;
}
