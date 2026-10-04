/**
 * LBMA-referenced spot quotes for gold/silver.
 *
 * This is a *price* rail only — it does not allocate metal, mint BPC, or
 * imply custody. Live commercial adapters keep the same shape so they can
 * be swapped without touching routes.
 */

export type PreciousMetal = "gold" | "silver";
export type QuoteCurrency = "USD" | "EUR";

export interface MetalQuote {
  metal: PreciousMetal;
  /** Price per troy ounce in quoteCurrency (market convention). */
  pricePerOunce: number;
  /** Price per gram in quoteCurrency (BPC / wallet convention). */
  pricePerGram: number;
  quoteCurrency: QuoteCurrency;
  asOf: string;
  /**
   * practice_indicative = local mock.
   * indicative_spot = live API quote. Never custody.
   */
  kind: "practice_indicative" | "indicative_spot";
  reference: "LBMA";
  source: string;
  liveCustody: false;
}

export interface PriceProvider {
  readonly id: string;
  getQuote(metal: PreciousMetal, quoteCurrency?: QuoteCurrency): Promise<MetalQuote>;
  getQuotes(quoteCurrency?: QuoteCurrency): Promise<MetalQuote[]>;
}

/** International troy ounce in grams. */
export const TROY_OUNCE_GRAMS = 31.1034768;
