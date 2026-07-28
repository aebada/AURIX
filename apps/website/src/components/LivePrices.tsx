"use client";

import { useEffect, useState } from "react";
import { Container } from "./Container";

// Illustrative only — jittered client-side, not a real market data feed.
// Mirrors the same "simulate a live feed without an external dependency"
// approach as services/ai/market-data's mock prices.
interface Ticker {
  symbol: string;
  name: string;
  category: "Metal" | "Crypto" | "Stock";
  price: number;
  changePct: number;
  direction: "up" | "down" | null;
}

const SEED: Omit<Ticker, "direction">[] = [
  { symbol: "XAU", name: "Gold", category: "Metal", price: 3387.4, changePct: 0.8 },
  { symbol: "XAG", name: "Silver", category: "Metal", price: 40.85, changePct: 1.4 },
  { symbol: "BTC", name: "Bitcoin", category: "Crypto", price: 118450, changePct: -1.2 },
  { symbol: "ETH", name: "Ethereum", category: "Crypto", price: 4210, changePct: 2.1 },
  { symbol: "SPX", name: "S&P 500", category: "Stock", price: 6390, changePct: 0.3 },
  { symbol: "AAPL", name: "Apple", category: "Stock", price: 231.5, changePct: -0.4 },
];

function jitter(value: number, pct = 0.0015) {
  return value * (1 + (Math.random() * 2 - 1) * pct);
}

function formatPrice(value: number) {
  return value.toLocaleString(undefined, {
    maximumFractionDigits: value >= 1000 ? 0 : 2,
    minimumFractionDigits: value >= 1000 ? 0 : 2,
  });
}

export function LivePrices() {
  const [tickers, setTickers] = useState<Ticker[]>(
    SEED.map((t) => ({ ...t, direction: null })),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setTickers((prev) =>
        prev.map((t) => {
          const next = jitter(t.price);
          return { ...t, price: next, direction: next >= t.price ? "up" : "down" };
        }),
      );
    }, 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="border-b border-[var(--color-line)] bg-[var(--color-surface)]">
      <Container>
        <div className="flex items-center justify-between pt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Live Markets
          </p>
          <p className="text-[11px] text-muted">
            Illustrative pricing — not real-time market data
          </p>
        </div>
        <div className="mt-3 flex gap-4 overflow-x-auto pb-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tickers.map((t) => (
            <div
              key={t.symbol}
              className="flex shrink-0 items-center gap-4 rounded-2xl border border-[var(--color-line)] px-4 py-3"
            >
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                  {t.category}
                </p>
                <p className="text-sm font-bold text-heading">{t.name}</p>
              </div>
              <div className="text-right">
                <p
                  className={`font-mono text-sm font-semibold transition-colors duration-300 ${
                    t.direction === "up"
                      ? "text-emerald-600"
                      : t.direction === "down"
                        ? "text-red-500"
                        : "text-heading"
                  }`}
                >
                  {formatPrice(t.price)}
                </p>
                <p
                  className={`text-xs font-semibold ${
                    t.changePct >= 0 ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {t.changePct >= 0 ? "▲" : "▼"} {Math.abs(t.changePct).toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
