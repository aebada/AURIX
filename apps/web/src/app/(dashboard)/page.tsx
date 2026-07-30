"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/Topbar";
import { Card, StatusBadge } from "@/components/Card";
import { WalletCard } from "@/components/WalletCard";
import { TaxIdPrompt } from "@/components/TaxIdPrompt";
import { useAuth } from "@/lib/auth-context";
import {
  walletApi,
  marketApi,
  paymentsApi,
  usersApi,
  ApiError,
  type Asset,
  type WalletBalance,
  type Transaction,
  type MarketPrices,
} from "@/lib/api";

const ASSETS: Asset[] = ["FIAT", "GOLD", "SILVER"];

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function OverviewPage() {
  const { token, user } = useAuth();
  const [balances, setBalances] = useState<WalletBalance[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [prices, setPrices] = useState<MarketPrices | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [version, setVersion] = useState(0);
  const [needsTaxId, setNeedsTaxId] = useState(false);

  const [selectedAsset, setSelectedAsset] = useState<Asset>("FIAT");
  const [topupAmount, setTopupAmount] = useState("1000");
  const [buyAmount, setBuyAmount] = useState("100");
  const [sellUnits, setSellUnits] = useState("1");
  const [sendEmail, setSendEmail] = useState("");
  const [sendAmount, setSendAmount] = useState("");

  useEffect(() => {
    if (!token) return;
    let ignore = false;

    (async () => {
      try {
        const [w, t, m, me] = await Promise.all([
          walletApi.balances(token),
          walletApi.transactions(token),
          marketApi.prices(),
          usersApi.me(token),
        ]);
        if (ignore) return;
        setBalances(w.balances);
        setTransactions(
          [...t.transactions].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
        );
        setPrices(m.prices);
        setNeedsTaxId(!me.taxId);
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
  const balanceByAsset: Record<Asset, number> = { FIAT: fiat, GOLD: gold, SILVER: silver };
  const pricePerUnit: Partial<Record<Asset, number>> = prices
    ? { GOLD: prices.goldUsdPerGram, SILVER: prices.silverUsdPerGram }
    : {};

  function refresh() {
    setVersion((v) => v + 1);
  }

  async function withBusy(action: () => Promise<void>, failureMessage: string) {
    if (!token) return;
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

  async function handleTopup() {
    await withBusy(async () => {
      await paymentsApi.topup(token!, Number(topupAmount));
      setNotice(`Topped up $${topupAmount} fiat.`);
      refresh();
    }, "Top-up failed");
  }

  async function handleBuy() {
    const price = pricePerUnit[selectedAsset as "GOLD" | "SILVER"];
    if (!price) return;
    await withBusy(async () => {
      await paymentsApi.buy(token!, selectedAsset as "GOLD" | "SILVER", Number(buyAmount), price);
      setNotice(`Bought ${selectedAsset.toLowerCase()} with $${buyAmount}.`);
      refresh();
    }, "Buy failed");
  }

  async function handleSell() {
    const price = pricePerUnit[selectedAsset as "GOLD" | "SILVER"];
    if (!price) return;
    await withBusy(async () => {
      await paymentsApi.sell(token!, selectedAsset as "GOLD" | "SILVER", Number(sellUnits), price);
      setNotice(`Sold ${sellUnits} ${selectedAsset.toLowerCase()}.`);
      refresh();
    }, "Sell failed");
  }

  async function handleSend() {
    await withBusy(async () => {
      await walletApi.transfer(token!, sendEmail, selectedAsset, Number(sendAmount));
      setNotice(`Sent ${sendAmount} ${selectedAsset.toLowerCase()} to ${sendEmail}.`);
      setSendEmail("");
      setSendAmount("");
      refresh();
    }, "Transfer failed");
  }

  const walletTransactions = transactions.filter((t) => t.asset === selectedAsset);

  return (
    <>
      <Topbar title="Overview" />
      <main className="flex-1 space-y-8 p-6 lg:p-10">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {needsTaxId && <TaxIdPrompt onSaved={() => setNeedsTaxId(false)} />}
        {notice && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {notice}
          </div>
        )}

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Wallets — {user?.email}
          </p>
          <div className="mt-3 flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {ASSETS.map((asset) => (
              <WalletCard
                key={asset}
                asset={asset}
                balance={balanceByAsset[asset]}
                usdValue={
                  asset === "FIAT"
                    ? null
                    : pricePerUnit[asset as "GOLD" | "SILVER"]
                      ? balanceByAsset[asset] * pricePerUnit[asset as "GOLD" | "SILVER"]!
                      : null
                }
                selected={selectedAsset === asset}
                onSelect={() => setSelectedAsset(asset)}
              />
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <p className="text-sm font-bold text-navy">
              {capitalize(selectedAsset.toLowerCase())} wallet actions
            </p>
            <p className="mt-1 text-xs text-muted">
              Live calls to services/backend (mock ledger, real API).
            </p>

            <div className="mt-4 flex flex-col gap-4">
              {selectedAsset === "FIAT" && (
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
                    Top up
                  </button>
                </div>
              )}

              {(selectedAsset === "GOLD" || selectedAsset === "SILVER") && (
                <>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(e.target.value)}
                      placeholder="USD to spend"
                      className="w-full rounded-xl border border-[var(--color-line)] px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleBuy}
                      disabled={busy || !pricePerUnit[selectedAsset]}
                      className="whitespace-nowrap rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      Buy
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={sellUnits}
                      onChange={(e) => setSellUnits(e.target.value)}
                      placeholder="Units to sell"
                      className="w-full rounded-xl border border-[var(--color-line)] px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleSell}
                      disabled={busy || !pricePerUnit[selectedAsset]}
                      className="whitespace-nowrap rounded-xl border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-navy disabled:opacity-50"
                    >
                      Sell
                    </button>
                  </div>
                  {pricePerUnit[selectedAsset] && (
                    <p className="text-xs text-muted">
                      Current price: ${pricePerUnit[selectedAsset]!.toFixed(2)}/g
                    </p>
                  )}
                </>
              )}
            </div>
          </Card>

          <Card>
            <p className="text-sm font-bold text-navy">
              Send {selectedAsset.toLowerCase()}
            </p>
            <p className="mt-1 text-xs text-muted">
              Transfer straight to another AURIX wallet by email.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <input
                type="email"
                value={sendEmail}
                onChange={(e) => setSendEmail(e.target.value)}
                placeholder="recipient@example.com"
                className="rounded-xl border border-[var(--color-line)] px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  placeholder={`Amount (${selectedAsset === "FIAT" ? "$" : "g"})`}
                  className="w-full rounded-xl border border-[var(--color-line)] px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={busy || !sendEmail || !sendAmount}
                  className="whitespace-nowrap rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-navy">
              {capitalize(selectedAsset.toLowerCase())} activity
            </p>
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
                  <th className="py-2 font-semibold">Amount</th>
                  <th className="py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {walletTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-muted">
                      No {selectedAsset.toLowerCase()} activity yet — try an action above.
                    </td>
                  </tr>
                ) : (
                  walletTransactions.slice(0, 6).map((t) => (
                    <tr key={t.id} className="border-b border-[var(--color-line)] last:border-0">
                      <td className="py-3 text-muted">{new Date(t.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 font-medium text-navy">{capitalize(t.type)}</td>
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
