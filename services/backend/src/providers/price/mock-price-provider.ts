import type { MetalQuote, PreciousMetal, PriceProvider, QuoteCurrency } from "./types.js";
import { TROY_OUNCE_GRAMS } from "./types.js";

/** Practice bases — not a live LBMA subscription. */
const BASE_USD_PER_GRAM: Record<PreciousMetal, number> = {
  gold: 87.42,
  silver: 1.03,
};

const EUR_USD = 1.08;

function jitter(value: number, pct = 0.002): number {
  const delta = value * pct * (Math.random() * 2 - 1);
  return Number((value + delta).toFixed(4));
}

function quote(metal: PreciousMetal, quoteCurrency: QuoteCurrency): MetalQuote {
  const usd = jitter(BASE_USD_PER_GRAM[metal]);
  const pricePerGram =
    quoteCurrency === "EUR" ? Number((usd / EUR_USD).toFixed(4)) : usd;
  return {
    metal,
    pricePerGram,
    pricePerOunce: Number((pricePerGram * TROY_OUNCE_GRAMS).toFixed(4)),
    quoteCurrency,
    asOf: new Date().toISOString(),
    kind: "practice_indicative",
    reference: "LBMA",
    source: "mock_price_provider",
    liveCustody: false,
  };
}

export const mockPriceProvider: PriceProvider = {
  id: "mock",
  async getQuote(metal, quoteCurrency = "USD") {
    return quote(metal, quoteCurrency);
  },
  async getQuotes(quoteCurrency = "USD") {
    return [quote("gold", quoteCurrency), quote("silver", quoteCurrency)];
  },
};
