"use client";

import { useEffect, useState } from "react";

// Illustrative only — jittered client-side, not a real market data feed.
// Mirrors the same "simulate a live feed without an external dependency"
// approach as services/backend's mock market-data endpoint. Shared between
// the homepage ticker (LivePrices) and the full /markets page.
export interface MarketInstrument {
  symbol: string;
  name: string;
  category: "Metal" | "Crypto" | "Stock";
  price: number;
  changePct: number;
}

export const MARKET_SEED: MarketInstrument[] = [
  { symbol: "XAU", name: "Gold", category: "Metal", price: 3387.4, changePct: 0.8 },
  { symbol: "XAG", name: "Silver", category: "Metal", price: 40.85, changePct: 1.4 },
  { symbol: "XPT", name: "Platinum", category: "Metal", price: 1428.2, changePct: -0.3 },
  { symbol: "XPD", name: "Palladium", category: "Metal", price: 1102.6, changePct: -1.1 },
  { symbol: "BTC", name: "Bitcoin", category: "Crypto", price: 118450, changePct: -1.2 },
  { symbol: "ETH", name: "Ethereum", category: "Crypto", price: 4210, changePct: 2.1 },
  { symbol: "SOL", name: "Solana", category: "Crypto", price: 198.4, changePct: 3.4 },
  { symbol: "XRP", name: "XRP", category: "Crypto", price: 2.87, changePct: -0.6 },
  { symbol: "SPX", name: "S&P 500", category: "Stock", price: 6390, changePct: 0.3 },
  { symbol: "NDX", name: "Nasdaq 100", category: "Stock", price: 22140, changePct: 0.5 },
  { symbol: "AAPL", name: "Apple", category: "Stock", price: 231.5, changePct: -0.4 },
  { symbol: "MSFT", name: "Microsoft", category: "Stock", price: 468.2, changePct: 0.7 },
  { symbol: "TSLA", name: "Tesla", category: "Stock", price: 312.8, changePct: -2.1 },
  { symbol: "AMZN", name: "Amazon", category: "Stock", price: 224.6, changePct: 1.0 },
];

export interface LiveInstrument extends MarketInstrument {
  direction: "up" | "down" | null;
}

function jitter(value: number, pct = 0.0015) {
  return value * (1 + (Math.random() * 2 - 1) * pct);
}

export function useLivePrices(seed: MarketInstrument[], intervalMs = 2500): LiveInstrument[] {
  const [items, setItems] = useState<LiveInstrument[]>(
    seed.map((t) => ({ ...t, direction: null })),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setItems((prev) =>
        prev.map((t) => {
          const next = jitter(t.price);
          return { ...t, price: next, direction: next >= t.price ? "up" : "down" };
        }),
      );
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return items;
}

export function formatPrice(value: number) {
  return value.toLocaleString(undefined, {
    maximumFractionDigits: value >= 1000 ? 0 : 2,
    minimumFractionDigits: value >= 1000 ? 0 : 2,
  });
}
