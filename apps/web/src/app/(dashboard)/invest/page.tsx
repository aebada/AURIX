"use client";

import { useEffect, useMemo, useState } from "react";
import { Topbar } from "@/components/Topbar";
import { Card, StatusBadge } from "@/components/Card";
import { useAuth } from "@/lib/auth-context";
import {
  etfApi,
  ApiError,
  type Etf,
  type EtfCategory,
  type EtfHoldingRow,
  type EtfOrder,
} from "@/lib/api";

const CATEGORY_LABELS: Record<EtfCategory, string> = {
  equity: "Equity",
  bond: "Bond",
  dividend: "Dividend",
  esg: "ESG",
  sector: "Sector",
  commodity: "Commodity",
  islamic: "Islamic",
};

const COUNTRIES = [
  { code: "", label: "All countries" },
  { code: "US", label: "United States" },
  { code: "GB", label: "United Kingdom" },
  { code: "DE", label: "Germany" },
  { code: "SA", label: "Saudi Arabia" },
  { code: "AE", label: "United Arab Emirates" },
  { code: "EG", label: "Egypt" },
  { code: "QA", label: "Qatar" },
  { code: "KW", label: "Kuwait" },
  { code: "MY", label: "Malaysia" },
  { code: "PK", label: "Pakistan" },
];

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function InvestPage() {
  const { token } = useAuth();

  const [etfs, setEtfs] = useState<Etf[]>([]);
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [query, setQuery] = useState("");

  const [portfolio, setPortfolio] = useState<{
    holdings: EtfHoldingRow[];
    totalValue: number;
    totalCost: number;
    totalGainLossUsd: number;
  } | null>(null);
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());
  const [orders, setOrders] = useState<EtfOrder[]>([]);

  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [buyAmount, setBuyAmount] = useState("100");
  const [sellUnits, setSellUnits] = useState("1");

  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    etfApi
      .list({ category: category || undefined, country: country || undefined, q: query || undefined })
      .then((res) => setEtfs(res.etfs))
      .catch((e) => setError(e instanceof ApiError ? e.message : "Failed to load ETFs"));
  }, [category, country, query]);

  useEffect(() => {
    if (!token) return;
    let ignore = false;
    (async () => {
      try {
        const [p, w, o] = await Promise.all([
          etfApi.portfolio(token),
          etfApi.watchlist(token),
          etfApi.orders(token),
        ]);
        if (ignore) return;
        setPortfolio(p);
        setWatchlist(new Set(w.etfs.map((e) => e.ticker)));
        setOrders(o.orders.slice(0, 8));
      } catch (e) {
        if (ignore) return;
        setError(e instanceof ApiError ? e.message : "Failed to load your ETF account data");
      }
    })();
    return () => {
      ignore = true;
    };
  }, [token, version]);

  const selected = useMemo(
    () => etfs.find((e) => e.ticker === selectedTicker) ?? null,
    [etfs, selectedTicker],
  );
  const selectedHolding = useMemo(
    () => portfolio?.holdings.find((h) => h.ticker === selectedTicker) ?? null,
    [portfolio, selectedTicker],
  );

  function refresh() {
    setVersion((v) => v + 1);
  }

  async function withBusy(action: () => Promise<void>, failureMessage: string) {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await action();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : failureMessage);
    } finally {
      setBusy(false);
    }
  }

  async function toggleWatchlist(ticker: string) {
    if (!token) return;
    await withBusy(async () => {
      if (watchlist.has(ticker)) {
        await etfApi.removeFromWatchlist(token, ticker);
        setWatchlist((prev) => {
          const next = new Set(prev);
          next.delete(ticker);
          return next;
        });
      } else {
        await etfApi.addToWatchlist(token, ticker);
        setWatchlist((prev) => new Set(prev).add(ticker));
      }
    }, "Watchlist update failed");
  }

  async function handleBuy() {
    if (!token || !selected) return;
    await withBusy(async () => {
      await etfApi.buy(token, selected.ticker, Number(buyAmount));
      setNotice(`Invested $${buyAmount} in ${selected.ticker}.`);
      refresh();
    }, "Buy failed");
  }

  async function handleSell() {
    if (!token || !selected) return;
    await withBusy(async () => {
      await etfApi.sell(token, selected.ticker, Number(sellUnits));
      setNotice(`Sold ${sellUnits} units of ${selected.ticker}.`);
      refresh();
    }, "Sell failed");
  }

  return (
    <>
      <Topbar title="Invest" />
      <main className="flex-1 space-y-8 p-6 lg:p-10">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {notice && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {notice}
          </div>
        )}

        <Card>
          <p className="text-sm font-bold text-navy">Your ETF portfolio</p>
          <p className="mt-1 text-xs text-muted">
            Fractional ETF investing, funded from your FIAT wallet — mock brokerage
            execution, real API.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-[var(--color-paper)] p-4">
              <p className="text-xs uppercase tracking-wider text-muted">Total value</p>
              <p className="mt-1 text-xl font-extrabold text-navy">
                ${(portfolio?.totalValue ?? 0).toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl bg-[var(--color-paper)] p-4">
              <p className="text-xs uppercase tracking-wider text-muted">Cost basis</p>
              <p className="mt-1 text-xl font-extrabold text-navy">
                ${(portfolio?.totalCost ?? 0).toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl bg-[var(--color-paper)] p-4">
              <p className="text-xs uppercase tracking-wider text-muted">Gain / loss</p>
              <p
                className={`mt-1 text-xl font-extrabold ${
                  (portfolio?.totalGainLossUsd ?? 0) >= 0 ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {(portfolio?.totalGainLossUsd ?? 0) >= 0 ? "+" : ""}
                ${(portfolio?.totalGainLossUsd ?? 0).toLocaleString()}
              </p>
            </div>
          </div>

          {portfolio && portfolio.holdings.length > 0 && (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-line)] text-xs uppercase tracking-wider text-muted">
                    <th className="py-2 font-semibold">Ticker</th>
                    <th className="py-2 font-semibold">Units</th>
                    <th className="py-2 font-semibold">Avg cost</th>
                    <th className="py-2 font-semibold">Price</th>
                    <th className="py-2 font-semibold">Value</th>
                    <th className="py-2 font-semibold">Gain / loss</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.holdings.map((h) => (
                    <tr
                      key={h.ticker}
                      className="cursor-pointer border-b border-[var(--color-line)] last:border-0 hover:bg-[var(--color-paper)]"
                      onClick={() => setSelectedTicker(h.ticker)}
                    >
                      <td className="py-3 font-semibold text-navy">{h.ticker}</td>
                      <td className="py-3 text-muted">{h.units.toFixed(4)}</td>
                      <td className="py-3 text-muted">${h.avgCostUsd.toFixed(2)}</td>
                      <td className="py-3 text-muted">${h.price.toFixed(2)}</td>
                      <td className="py-3 font-semibold text-navy">${h.currentValue.toFixed(2)}</td>
                      <td className={`py-3 ${h.gainLossUsd >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                        {h.gainLossUsd >= 0 ? "+" : ""}
                        ${h.gainLossUsd.toFixed(2)} ({h.gainLossPct.toFixed(1)}%)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {selected && (
          <Card>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted">
                  {selected.provider} · {CATEGORY_LABELS[selected.category]} · {selected.exchange}
                </p>
                <p className="mt-1 text-lg font-extrabold text-navy">
                  {selected.name} ({selected.ticker})
                </p>
                <p className="mt-1 text-sm text-muted">{selected.description}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleWatchlist(selected.ticker)}
                disabled={busy || !token}
                className={`whitespace-nowrap rounded-xl border px-3 py-2 text-xs font-semibold disabled:opacity-50 ${
                  watchlist.has(selected.ticker)
                    ? "border-gold-dark bg-gold-dark/10 text-gold-dark"
                    : "border-[var(--color-line)] text-navy"
                }`}
              >
                {watchlist.has(selected.ticker) ? "★ Watchlisted" : "☆ Watchlist"}
              </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted">Price</p>
                <p className="mt-1 font-semibold text-navy">
                  {selected.currency} {selected.price.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted">1Y return</p>
                <p
                  className={`mt-1 font-semibold ${
                    selected.oneYearReturnPct >= 0 ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {selected.oneYearReturnPct >= 0 ? "+" : ""}
                  {selected.oneYearReturnPct.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted">Expense ratio</p>
                <p className="mt-1 font-semibold text-navy">{selected.expenseRatioPct.toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted">Dividend yield</p>
                <p className="mt-1 font-semibold text-navy">{selected.dividendYieldPct.toFixed(1)}%</p>
              </div>
            </div>

            <p className="mt-4 text-xs text-muted">
              Top holdings: {selected.topHoldings.join(", ")} · Risk: {capitalize(selected.riskLevel)} ·
              Min investment: ${selected.minInvestment}
              {selectedHolding && (
                <>
                  {" "}
                  · You own {selectedHolding.units.toFixed(4)} units (${selectedHolding.currentValue.toFixed(2)})
                </>
              )}
            </p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm font-bold text-navy">Buy</p>
                <div className="mt-2 flex gap-2">
                  <input
                    type="number"
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(e.target.value)}
                    placeholder={`USD (min $${selected.minInvestment})`}
                    className="w-full rounded-xl border border-[var(--color-line)] px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleBuy}
                    disabled={busy || !token}
                    className="whitespace-nowrap rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    Buy
                  </button>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-navy">Sell</p>
                <div className="mt-2 flex gap-2">
                  <input
                    type="number"
                    value={sellUnits}
                    onChange={(e) => setSellUnits(e.target.value)}
                    placeholder="Units"
                    className="w-full rounded-xl border border-[var(--color-line)] px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleSell}
                    disabled={busy || !token || !selectedHolding}
                    className="whitespace-nowrap rounded-xl border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-navy disabled:opacity-50"
                  >
                    Sell
                  </button>
                </div>
              </div>
            </div>
          </Card>
        )}

        <Card>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-[var(--color-line)] px-3 py-2 text-sm"
            >
              <option value="">All categories</option>
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="rounded-xl border border-[var(--color-line)] px-3 py-2 text-sm"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, ticker, or theme"
              className="min-w-[220px] flex-1 rounded-xl border border-[var(--color-line)] px-3 py-2 text-sm"
            />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {etfs.length === 0 ? (
              <p className="text-sm text-muted">No ETFs match these filters.</p>
            ) : (
              etfs.map((e) => (
                <button
                  key={e.ticker}
                  type="button"
                  onClick={() => setSelectedTicker(e.ticker)}
                  className={`rounded-2xl border p-4 text-left transition-colors ${
                    selectedTicker === e.ticker
                      ? "border-navy bg-[var(--color-paper)]"
                      : "border-[var(--color-line)] hover:bg-[var(--color-paper)]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-navy">{e.ticker}</p>
                      <p className="text-xs text-muted">{e.name}</p>
                    </div>
                    {watchlist.has(e.ticker) && <span className="text-gold-dark">★</span>}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="font-semibold text-navy">
                      {e.currency} {e.price.toFixed(2)}
                    </span>
                    <span className={e.oneYearReturnPct >= 0 ? "text-emerald-600" : "text-red-600"}>
                      {e.oneYearReturnPct >= 0 ? "+" : ""}
                      {e.oneYearReturnPct.toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-2">
                    <StatusBadge status={CATEGORY_LABELS[e.category]} />
                  </div>
                </button>
              ))
            )}
          </div>
        </Card>

        {token && (
          <Card>
            <p className="text-sm font-bold text-navy">Recent ETF orders</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-line)] text-xs uppercase tracking-wider text-muted">
                    <th className="py-2 font-semibold">Date</th>
                    <th className="py-2 font-semibold">Ticker</th>
                    <th className="py-2 font-semibold">Side</th>
                    <th className="py-2 font-semibold">Units</th>
                    <th className="py-2 font-semibold">Amount</th>
                    <th className="py-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-muted">
                        No ETF orders yet — buy one above to get started.
                      </td>
                    </tr>
                  ) : (
                    orders.map((o) => (
                      <tr key={o.id} className="border-b border-[var(--color-line)] last:border-0">
                        <td className="py-3 text-muted">{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 font-medium text-navy">{o.ticker}</td>
                        <td className="py-3 text-muted">{capitalize(o.side)}</td>
                        <td className="py-3 text-muted">{o.units.toFixed(4)}</td>
                        <td className="py-3 font-semibold text-navy">${o.fiatAmountUsd.toFixed(2)}</td>
                        <td className="py-3">
                          <StatusBadge status={capitalize(o.status)} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
    </>
  );
}
