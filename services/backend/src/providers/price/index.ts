import { livePriceProvider } from "./live-price-provider.js";
import { mockPriceProvider } from "./mock-price-provider.js";
import type { PriceProvider } from "./types.js";

export type { MetalQuote, PreciousMetal, PriceProvider, QuoteCurrency } from "./types.js";
export { TROY_OUNCE_GRAMS } from "./types.js";
export { mockPriceProvider } from "./mock-price-provider.js";
export { livePriceProvider } from "./live-price-provider.js";

/**
 * Default is the practice mock (section 5 stubs). Set PRICE_PROVIDER=live
 * to use the gold-api.com adapter. Price ≠ custody: RESERVE_LIVE stays independent.
 * Routes should fall back to mock if the live fetch fails.
 */
export function getPriceProvider(): PriceProvider {
  if (process.env.PRICE_PROVIDER === "live") return livePriceProvider;
  return mockPriceProvider;
}
