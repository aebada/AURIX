import type { MetalQuote, PreciousMetal, PriceProvider, QuoteCurrency } from "./types.js";
import { TROY_OUNCE_GRAMS } from "./types.js";

const GOLD_API_BASE = "https://api.gold-api.com/price";
const FX_URL = "https://open.er-api.com/v6/latest/USD";
const CACHE_MS = 45_000;

type CacheEntry = { at: number; usdPerOz: Record<PreciousMetal, number>; eurPerUsd: number };

let cache: CacheEntry | null = null;

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8_000),
  });
  if (!res.ok) {
    throw new Error(`price_http_${res.status}`);
  }
  return res.json();
}

function ounceUsdFromPayload(payload: unknown): number {
  if (!payload || typeof payload !== "object") throw new Error("price_shape");
  const price = (payload as { price?: unknown }).price;
  if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) {
    throw new Error("price_shape");
  }
  return price;
}

async function loadSpot(): Promise<CacheEntry> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache;

  const [goldRaw, silverRaw, fxRaw] = await Promise.all([
    fetchJson(`${GOLD_API_BASE}/XAU`),
    fetchJson(`${GOLD_API_BASE}/XAG`),
    fetchJson(FX_URL),
  ]);

  const eur =
    fxRaw &&
    typeof fxRaw === "object" &&
    (fxRaw as { rates?: { EUR?: number } }).rates?.EUR;
  if (typeof eur !== "number" || eur <= 0) throw new Error("fx_shape");

  cache = {
    at: Date.now(),
    usdPerOz: {
      gold: ounceUsdFromPayload(goldRaw),
      silver: ounceUsdFromPayload(silverRaw),
    },
    eurPerUsd: eur,
  };
  return cache;
}

function toQuote(
  metal: PreciousMetal,
  quoteCurrency: QuoteCurrency,
  spot: CacheEntry,
): MetalQuote {
  const usdOz = spot.usdPerOz[metal];
  const pricePerOunce =
    quoteCurrency === "EUR" ? usdOz * spot.eurPerUsd : usdOz;
  const pricePerGram = pricePerOunce / TROY_OUNCE_GRAMS;
  return {
    metal,
    pricePerOunce: Number(pricePerOunce.toFixed(4)),
    pricePerGram: Number(pricePerGram.toFixed(6)),
    quoteCurrency,
    asOf: new Date(spot.at).toISOString(),
    kind: "indicative_spot",
    reference: "LBMA",
    source: "gold-api.com+open.er-api.com",
    liveCustody: false,
  };
}

/**
 * Live London-linked spot via gold-api.com (XAU/XAG USD/oz) + open.er-api FX.
 * Optional METALS_API_KEY / METALPRICE_API_KEY can be added later without
 * changing the PriceProvider surface.
 */
export const livePriceProvider: PriceProvider = {
  id: "gold-api.com",
  async getQuote(metal, quoteCurrency = "USD") {
    const spot = await loadSpot();
    return toQuote(metal, quoteCurrency, spot);
  },
  async getQuotes(quoteCurrency = "USD") {
    const spot = await loadSpot();
    return [toQuote("gold", quoteCurrency, spot), toQuote("silver", quoteCurrency, spot)];
  },
};
