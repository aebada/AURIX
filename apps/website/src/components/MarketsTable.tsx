"use client";

import { MARKET_SEED, useLivePrices, formatPrice, type MarketInstrument } from "@/lib/live-market-data";

const CATEGORIES: { label: string; value: MarketInstrument["category"] }[] = [
  { label: "Metals", value: "Metal" },
  { label: "Crypto", value: "Crypto" },
  { label: "Stocks & Indices", value: "Stock" },
];

export function MarketsTable() {
  const instruments = useLivePrices(MARKET_SEED);

  return (
    <div className="space-y-14">
      {CATEGORIES.map((cat) => {
        const rows = instruments.filter((i) => i.category === cat.value);
        return (
          <div key={cat.value}>
            <h2 className="font-extrabold tracking-tight text-xl text-heading">
              {cat.label}
            </h2>
            <div className="mt-5 overflow-x-auto rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)]">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-line)] text-xs uppercase tracking-wider text-muted">
                    <th className="px-6 py-4 font-semibold">Symbol</th>
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Price</th>
                    <th className="px-6 py-4 font-semibold">24h</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.symbol} className="border-b border-[var(--color-line)] last:border-0">
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-muted">
                        {row.symbol}
                      </td>
                      <td className="px-6 py-4 font-medium text-heading">{row.name}</td>
                      <td
                        className={`px-6 py-4 font-mono font-semibold transition-colors duration-300 ${
                          row.direction === "up"
                            ? "text-emerald-600"
                            : row.direction === "down"
                              ? "text-red-500"
                              : "text-heading"
                        }`}
                      >
                        {formatPrice(row.price)}
                      </td>
                      <td
                        className={`px-6 py-4 font-semibold ${
                          row.changePct >= 0 ? "text-emerald-600" : "text-red-500"
                        }`}
                      >
                        {row.changePct >= 0 ? "▲" : "▼"} {Math.abs(row.changePct).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
