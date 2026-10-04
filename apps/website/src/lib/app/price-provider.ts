/**
 * Practice PriceProvider for /app (LBMA-referenced mock).
 * Does not claim custody, vault allocation, or live online gold orders.
 */

import { PRACTICE_PRICES, type Metal } from "./types";

export interface PracticeMetalQuote {
  metal: Metal;
  pricePerGram: number;
  quoteCurrency: "EUR";
  kind: "practice_indicative";
  reference: "LBMA";
  source: "practice_mock";
  liveCustody: false;
}

export interface PracticePriceProvider {
  readonly id: string;
  getQuote(metal: Metal): PracticeMetalQuote;
}

export const mockPracticePriceProvider: PracticePriceProvider = {
  id: "practice_mock",
  getQuote(metal) {
    return {
      metal,
      pricePerGram:
        metal === "gold"
          ? PRACTICE_PRICES.goldEurPerGram
          : PRACTICE_PRICES.silverEurPerGram,
      quoteCurrency: "EUR",
      kind: "practice_indicative",
      reference: "LBMA",
      source: "practice_mock",
      liveCustody: false,
    };
  },
};

export function getPracticePriceProvider(): PracticePriceProvider {
  return mockPracticePriceProvider;
}
