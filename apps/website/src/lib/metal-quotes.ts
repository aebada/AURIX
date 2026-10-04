"use client";

import { useEffect, useState } from "react";

export interface MetalQuote {
  metal: "gold" | "silver";
  pricePerOunce: number;
  pricePerGram: number;
  quoteCurrency: "USD" | "EUR";
  asOf: string;
  kind: "practice_indicative" | "indicative_spot";
  source: string;
  liveCustody: false;
}

export interface MetalQuotesPayload {
  asOf: string;
  liveCustody: false;
  kind: "practice_indicative" | "indicative_spot";
  source: string;
  quotes: MetalQuote[];
}

const TROY_OUNCE_GRAMS = 31.1034768;

function quotesEndpoint(currency: "USD" | "EUR"): string | null {
  if (process.env.NEXT_PUBLIC_USE_PHP_AUTH === "1") {
    return `/auth/metal-quotes.php?currency=${currency}`;
  }
  const api = process.env.NEXT_PUBLIC_API_URL;
  if (api) return `${api.replace(/\/$/, "")}/market-data/prices?currency=${currency}`;
  return null;
}

async function fetchGoldApi(currency: "USD" | "EUR"): Promise<MetalQuotesPayload> {
  const [goldRes, silverRes, fxRes] = await Promise.all([
    fetch("https://api.gold-api.com/price/XAU"),
    fetch("https://api.gold-api.com/price/XAG"),
    fetch("https://open.er-api.com/v6/latest/USD"),
  ]);
  if (!goldRes.ok || !silverRes.ok) throw new Error("gold_api");
  const gold = (await goldRes.json()) as { price?: number };
  const silver = (await silverRes.json()) as { price?: number };
  const fx = (await fxRes.json()) as { rates?: { EUR?: number } };
  const eur = fx.rates?.EUR ?? 0;
  if (!gold.price || !silver.price || eur <= 0) throw new Error("gold_api_shape");
  const mult = currency === "EUR" ? eur : 1;
  const asOf = new Date().toISOString();
  const toQuote = (metal: "gold" | "silver", usdOz: number): MetalQuote => {
    const oz = usdOz * mult;
    return {
      metal,
      pricePerOunce: Number(oz.toFixed(4)),
      pricePerGram: Number((oz / TROY_OUNCE_GRAMS).toFixed(6)),
      quoteCurrency: currency,
      asOf,
      kind: "indicative_spot",
      source: "gold-api.com+open.er-api.com",
      liveCustody: false,
    };
  };
  return {
    asOf,
    liveCustody: false,
    kind: "indicative_spot",
    source: "gold-api.com+open.er-api.com",
    quotes: [toQuote("gold", gold.price), toQuote("silver", silver.price)],
  };
}

export async function fetchMetalQuotes(
  currency: "USD" | "EUR" = "USD",
): Promise<MetalQuotesPayload> {
  const url = quotesEndpoint(currency);
  if (url) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as MetalQuotesPayload;
        if (data?.quotes?.length) return data;
      }
    } catch {
      /* fall through to public gold-api */
    }
  }
  return fetchGoldApi(currency);
}

export function useMetalQuotes(currency: "USD" | "EUR" = "USD") {
  const [payload, setPayload] = useState<MetalQuotesPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const next = await fetchMetalQuotes(currency);
        if (!cancelled) {
          setPayload(next);
          setError(null);
        }
      } catch {
        if (!cancelled) setError("quotes_unavailable");
      }
    }
    void load();
    const id = setInterval(() => void load(), 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [currency]);

  const gold = payload?.quotes.find((q) => q.metal === "gold") ?? null;
  const silver = payload?.quotes.find((q) => q.metal === "silver") ?? null;
  return { payload, gold, silver, error, live: payload?.kind === "indicative_spot" };
}
