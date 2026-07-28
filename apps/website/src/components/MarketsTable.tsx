"use client";

import { useMemo, useState } from "react";
import { METALS, CRYPTO, STOCKS, useLivePrices, formatPrice, type MarketInstrument } from "@/lib/live-market-data";

const PAGE_SIZE = 25;

function CategorySection({
  label,
  fullList,
}: {
  label: string;
  fullList: MarketInstrument[];
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

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
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-muted">
                  No matches for &ldquo;{query}&rdquo;.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
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
              ))
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
    </div>
  );
}
