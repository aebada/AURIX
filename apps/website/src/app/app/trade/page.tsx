"use client";

import { useState } from "react";
import { AppPage } from "@/components/app/AppShell";
import {
  Field,
  Notice,
  Panel,
  PrimaryButton,
  SecondaryButton,
  inputClass,
} from "@/components/app/chrome";
import {
  formatEur,
  formatGrams,
  usePractice,
} from "@/lib/app/practice-store";
import { PRACTICE_PRICES, type Metal } from "@/lib/app/types";

export default function TradePage() {
  const { activeWallet, buy, sell, practiceEnabled } = usePractice();
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [metal, setMetal] = useState<Metal>("gold");
  const [amount, setAmount] = useState("100");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const price =
    metal === "gold"
      ? PRACTICE_PRICES.goldEurPerGram
      : PRACTICE_PRICES.silverEurPerGram;
  const n = Number(amount) || 0;
  const fee =
    side === "buy"
      ? n * PRACTICE_PRICES.feeRate
      : n * price * PRACTICE_PRICES.feeRate;
  const total =
    side === "buy" ? n + fee : n * price - fee;

  function submit() {
    setMsg(null);
    setErr(null);
    const error =
      side === "buy" ? buy(metal, n) : sell(metal, n);
    if (error) setErr(error);
    else {
      setMsg(
        side === "buy"
          ? `Bought ${metal} with ${formatEur(n)} (practice)`
          : `Sold ${formatGrams(n)} ${metal} (practice)`,
      );
      setAmount("");
    }
  }

  return (
    <AppPage title="Buy / Sell" subtitle={`Trading against ${activeWallet.name}`}>
      {err && <Notice tone="err">{err}</Notice>}
      {msg && <Notice tone="ok">{msg}</Notice>}
      {!practiceEnabled && (
        <Notice tone="info">Enable Practice mode in Profile to trade virtual metals.</Notice>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Order ticket" className="lg:col-span-2">
          <div className="mb-4 flex rounded-lg border border-[var(--color-line)] p-1">
            {(["buy", "sell"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSide(s)}
                className={`flex-1 rounded-md py-2 text-sm font-semibold capitalize ${
                  side === s
                    ? "bg-gold text-navy"
                    : "text-muted hover:text-heading"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="mb-4 flex gap-2">
            {(["gold", "silver"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMetal(m)}
                className={`rounded-lg border px-4 py-2 text-sm font-semibold capitalize ${
                  metal === m
                    ? "border-navy bg-navy text-white"
                    : "border-[var(--color-line)] text-heading"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <Field
            label={
              side === "buy" ? "Amount to spend (EUR)" : "Grams to sell"
            }
          >
            <input
              className={inputClass}
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Field>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Practice price</dt>
              <dd className="font-semibold">{formatEur(price)} / g</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Fee (0.5%)</dt>
              <dd>{formatEur(fee)}</dd>
            </div>
            <div className="flex justify-between border-t border-[var(--color-line)] pt-2">
              <dt className="font-semibold text-heading">
                {side === "buy" ? "You pay" : "You receive"}
              </dt>
              <dd className="font-bold text-heading">{formatEur(total)}</dd>
            </div>
          </dl>

          <div className="mt-6 flex gap-3">
            <PrimaryButton onClick={submit} disabled={!practiceEnabled || n <= 0}>
              Confirm {side}
            </PrimaryButton>
            <SecondaryButton onClick={() => setAmount("")}>Clear</SecondaryButton>
          </div>
        </Panel>

        <Panel title="Wallet pockets" description={activeWallet.name}>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between">
              <span className="text-muted">Fiat</span>
              <span className="font-semibold">
                {formatEur(activeWallet.balances.fiatEur)}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted">Gold</span>
              <span className="font-semibold">
                {formatGrams(activeWallet.balances.goldGrams)}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted">Silver</span>
              <span className="font-semibold">
                {formatGrams(activeWallet.balances.silverGrams)}
              </span>
            </li>
          </ul>
        </Panel>
      </div>
    </AppPage>
  );
}
