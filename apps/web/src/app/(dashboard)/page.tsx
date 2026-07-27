"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/Topbar";
import { Card, StatusBadge } from "@/components/Card";
import { useAuth } from "@/lib/auth-context";
import {
  walletApi,
  marketApi,
  paymentsApi,
  ApiError,
  type WalletBalance,
  type Transaction,
  type MarketPrices,
} from "@/lib/api";

const ASSET_COLOR_VAR: Record<string, string> = {
  Gold: "--color-gold",
  Silver: "--color-navy-soft",
  Fiat: "--color-line",
};

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function OverviewPage() {
  const { token } = useAuth();
  const [balances, setBalances] = useState<WalletBalance[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [prices, setPrices] = useState<MarketPrices | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [topupAmount, setTopupAmount] = useState("1000");
  const [busy, setBusy] = useState(false);

  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!token) return;
    let ignore = false;

    (async () => {
      try {
        const [w, t, m] = await Promise.all([
          walletApi.balances(token),
          walletApi.transactions(token),
          marketApi.prices(),
        ]);
        if (ignore) return;
        setBalances(w.balances);
        setTransactions(
          [...t.transactions].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
        );
        setPrices(m.prices);
        setError(null);
      } catch (e) {
        if (ignore) return;
        setError(e instanceof ApiError ? e.message : "Failed to load account data");
      }
    })();

    return () => {
      ignore = true;
    };
  }, [token, version]);

  const fiat = balances.find((b) => b.asset === "FIAT")?.balance ?? 0;
  const gold = balances.find((b) => b.asset === "GOLD")?.balance ?? 0;
  const silver = balances.find((b) => b.asset === "SILVER")?.balance ?? 0;
  const goldUsd = prices ? gold * prices.goldUsdPerGram : 0;
  const silverUsd = prices ? silver * prices.silverUsdPerGram : 0;
  const totalUsd = fiat + goldUsd + silverUsd;

  const allocation =
    totalUsd > 0
      ? [
          { asset: "Gold", pct: Math.round((goldUsd / totalUsd) * 100) },
          { asset: "Silver", pct: Math.round((silverUsd / totalUsd) * 100) },
          { asset: "Fiat", pct: Math.round((fiat / totalUsd) * 100) },
        ].filter((a) => a.pct > 0)
      : [];

  async function handleTopup() {
    if (!token) return;
    setBusy(true);
    setError(null);
    try {
      await paymentsApi.topup(token, Number(topupAmount));
      setVersion((v) => v + 1);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Top-up failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleBuyGold() {
    if (!token || !prices) return;
    setBusy(true);
    setError(null);
    try {
      await paymentsApi.buy(token, "GOLD", 100, prices.goldUsdPerGram);
      setVersion((v) => v + 1);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Buy failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Topbar title="Overview" />
      <main className="flex-1 space-y-8 p-6 lg:p-10">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Total portfolio value
            </p>
            <p className="mt-2 text-4xl font-extrabold tracking-tight text-navy">
              ${totalUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            <p className="mt-1 text-sm text-muted">
              Live from services/backend wallet ledger
            </p>

            {allocation.length > 0 && (
              <>
                <div className="mt-6 flex h-3 w-full overflow-hidden rounded-full bg-[var(--color-paper)]">
                  {allocation.map((a) => (
                    <div
                      key={a.asset}
                      style={{ width: `${a.pct}%`, backgroundColor: `var(${ASSET_COLOR_VAR[a.asset]})` }}
                    />
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {allocation.map((a) => (
                    <div key={a.asset} className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: `var(${ASSET_COLOR_VAR[a.asset]})` }}
                      />
                      <span className="text-xs font-medium text-muted">
                        {a.asset} · {a.pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>

          <Card>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Quick actions
            </p>
            <p className="mt-2 text-sm text-muted">
              Live calls to services/backend (mock ledger, real API).
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <div className="flex gap-2">
                <input
                  type="number"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  className="w-full rounded-xl border border-[var(--color-line)] px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={handleTopup}
                  disabled={busy}
                  className="whitespace-nowrap rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Top up fiat
                </button>
              </div>
              <button
                type="button"
                onClick={handleBuyGold}
                disabled={busy || !prices}
                className="rounded-xl border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-navy disabled:opacity-50"
              >
                Buy $100 of gold {prices ? `(@ $${prices.goldUsdPerGram}/g)` : ""}
              </button>
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-navy">Recent transactions</p>
            <a href="/transactions" className="text-sm font-semibold text-gold-dark hover:underline">
              View all
            </a>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-line)] text-xs uppercase tracking-wider text-muted">
                  <th className="py-2 font-semibold">Date</th>
                  <th className="py-2 font-semibold">Type</th>
                  <th className="py-2 font-semibold">Asset</th>
                  <th className="py-2 font-semibold">Amount</th>
                  <th className="py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-muted">
                      No transactions yet — try a quick action above.
                    </td>
                  </tr>
                ) : (
                  transactions.slice(0, 4).map((t) => (
                    <tr key={t.id} className="border-b border-[var(--color-line)] last:border-0">
                      <td className="py-3 text-muted">{new Date(t.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 font-medium text-navy">{capitalize(t.type)}</td>
                      <td className="py-3 text-muted">{t.asset}</td>
                      <td className="py-3 font-semibold text-navy">{t.amount}</td>
                      <td className="py-3">
                        <StatusBadge status={capitalize(t.status)} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </>
  );
}
