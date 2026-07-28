"use client";

import Link from "next/link";
import { Container } from "./Container";
import { MARKET_SEED, useLivePrices, formatPrice } from "@/lib/live-market-data";
import { useCurrency } from "@/lib/currency-context";

const HEADLINE_SYMBOLS = ["XAU", "XAG", "BTC", "ETH", "SPX", "AAPL"];
const HEADLINE_SEED = MARKET_SEED.filter((t) => HEADLINE_SYMBOLS.includes(t.symbol));

export function LivePrices() {
  const tickers = useLivePrices(HEADLINE_SEED);
  const { currency } = useCurrency();

  return (
    <div className="border-b border-[var(--color-line)] bg-[var(--color-surface)]">
      <Container>
        <div className="flex items-center justify-between pt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Live Markets
          </p>
          <p className="hidden text-[11px] text-muted sm:block">
            Illustrative pricing — not real-time market data
          </p>
        </div>
        <div className="mt-3 flex items-center gap-4 overflow-x-auto pb-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                  {formatPrice(t.price, currency)}
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
          <Link
            href="/markets"
            className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-2xl border border-dashed border-[var(--color-line)] px-4 py-3 text-sm font-semibold text-gold-dark transition-colors hover:border-gold"
          >
            View all markets →
          </Link>
        </div>
      </Container>
    </div>
  );
}
