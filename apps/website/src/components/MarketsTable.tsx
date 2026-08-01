"use client";

import { useMemo, useState } from "react";
import {
  METALS,
  CRYPTO,
  STOCKS,
  ETFS,
  useLivePrices,
  formatPrice,
  changeForTimeframe,
  momentumSignal,
  MOMENTUM_LABELS,
  TIMEFRAME_COLUMN_LABELS,
  type MarketInstrument,
  type ChangeTimeframe,
  type MomentumSignal,
} from "@/lib/live-market-data";
import { useCurrency } from "@/lib/currency-context";

const PAGE_SIZE = 25;

const SIGNAL_STYLES: Record<MomentumSignal, string> = {
  bullish: "bg-emerald-50 text-emerald-700",
  neutral: "bg-zinc-100 text-zinc-600",
  bearish: "bg-red-50 text-red-600",
};

function SignalBadge({ signal }: { signal: MomentumSignal }) {
  return (
    <span
      title="Illustrative momentum read from recent price trend — not financial advice."
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${SIGNAL_STYLES[signal]}`}
    >
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rounded-full ${
          signal === "bullish" ? "bg-emerald-500" : signal === "bearish" ? "bg-red-500" : "bg-zinc-400"
        }`}
      />
      {MOMENTUM_LABELS[signal]}
    </span>
  );
}

const TIMEFRAME_OPTIONS: ChangeTimeframe[] = [
  "24h",
  "7d",
  "1m",
  "3m",
  "6m",
  "ytd",
  "1y",
  "2y",
  "3y",
  "5y",
];

function CategorySection({
  label,
  fullList,
}: {
  label: string;
  fullList: MarketInstrument[];
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [timeframe, setTimeframe] = useState<ChangeTimeframe>("24h");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return fullList;
    return fullList.filter(
      (i) => i.name.toLowerCase().includes(q) || i.symbol.toLowerCase().includes(q),
    );
  }, [fullList, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const pageSlice = useMemo(
    () => filtered.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE),
    [filtered, currentPage],
  );
  const rows = useLivePrices(pageSlice);
  const { currency } = useCurrency();
  const timeframeId = `timeframe-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-extrabold tracking-tight text-xl text-heading">
          {label} <span className="text-sm font-medium text-muted">({filtered.length})</span>
        </h2>
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(0);
          }}
          placeholder={`Search ${label.toLowerCase()}…`}
          className="w-full max-w-xs rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-2 text-sm text-heading focus:border-gold focus:outline-none"
        />
      </div>

      <div className="mt-5 overflow-x-auto rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)]">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--color-line)] text-xs uppercase tracking-wider text-muted">
              <th className="px-6 py-4 font-semibold">Symbol</th>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Price</th>
              <th className="px-6 py-4 font-semibold">
                <select
                  id={timeframeId}
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value as ChangeTimeframe)}
                  title="Change the timeframe for this column"
                  aria-label={`${label} change timeframe`}
                  className="w-11 cursor-pointer appearance-none border-0 bg-transparent p-0 text-xs font-semibold uppercase tracking-wider text-muted outline-none hover:text-heading focus:text-heading"
                >
                  {TIMEFRAME_OPTIONS.map((tf) => (
                    <option key={tf} value={tf}>
                      {TIMEFRAME_COLUMN_LABELS[tf]}
                    </option>
                  ))}
                </select>
                <span aria-hidden className="ml-1 text-[10px]">▾</span>
              </th>
              <th className="px-6 py-4 font-semibold">Signal</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted">
                  No matches for &ldquo;{query}&rdquo;.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const change = changeForTimeframe(row, timeframe);
                return (
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
                      {formatPrice(row.price, currency)}
                    </td>
                    <td
                      className={`px-6 py-4 font-semibold ${
                        change >= 0 ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4">
                      <SignalBadge signal={momentumSignal(row)} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="rounded-full border border-[var(--color-line)] px-4 py-2 font-semibold text-heading disabled:opacity-40"
          >
            Previous
          </button>
          <p className="text-muted">
            Page {currentPage + 1} of {totalPages}
          </p>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage >= totalPages - 1}
            className="rounded-full border border-[var(--color-line)] px-4 py-2 font-semibold text-heading disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export function MarketsTable() {
  return (
    <div className="space-y-16">
      <CategorySection label="Metals" fullList={METALS} />
      <CategorySection label="Crypto" fullList={CRYPTO} />
      <CategorySection label="Stocks & Indices" fullList={STOCKS} />
      <CategorySection label="ETFs" fullList={ETFS} />
    </div>
  );
}
