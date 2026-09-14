"use client";

import { useState } from "react";
import { AppPage } from "@/components/app/AppShell";
import {
  Field,
  Notice,
  Panel,
  PrimaryButton,
  inputClass,
} from "@/components/app/chrome";
import {
  formatEur,
  formatGrams,
  usePractice,
} from "@/lib/app/practice-store";
import { PRACTICE_PRICES } from "@/lib/app/types";

const MARKET = [
  {
    symbol: "XAU",
    label: "Gold",
    price: PRACTICE_PRICES.goldEurPerGram,
    change: 0.4,
  },
  {
    symbol: "XAG",
    label: "Silver",
    price: PRACTICE_PRICES.silverEurPerGram,
    change: -0.2,
  },
];

export default function MarketsPage() {
  const { state, contributeToVault, practiceEnabled } = usePractice();
  const vault = state.wallets.find((w) => w.kind === "savings");
  const personal = state.wallets.find((w) => w.kind === "personal");
  const [grams, setGrams] = useState("1");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  function contribute() {
    setMsg(null);
    setErr(null);
    const error = contributeToVault(Number(grams) || 0);
    if (error) setErr(error);
    else {
      setMsg("Vault updated — practice gold only.");
      setGrams("");
    }
  }

  return (
    <AppPage title="Markets" subtitle="Practice prices · vault contributions">
      {err && <Notice tone="err">{err}</Notice>}
      {msg && <Notice tone="ok">{msg}</Notice>}

      <Panel title="Live practice prices" description="Independent of live quotes in practice mode">
        <div className="grid gap-4 sm:grid-cols-2">
          {MARKET.map((m) => (
            <div
              key={m.symbol}
              className="rounded-lg border border-[var(--color-line)] p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-heading">{m.label}</p>
                  <p className="text-xs text-muted">{m.symbol}</p>
                </div>
                <p
                  className={`text-sm font-semibold ${
                    m.change >= 0 ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {m.change >= 0 ? "+" : ""}
                  {m.change.toFixed(1)}%
                </p>
              </div>
              <p className="mt-3 text-2xl font-extrabold text-heading">
                {formatEur(m.price)}
                <span className="text-sm font-medium text-muted"> / g</span>
              </p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Gold Vault"
          description="Savings pocket nested under Personal (Revolut-style vault)"
        >
          <p className="text-3xl font-extrabold text-heading">
            {formatGrams(vault?.balances.goldGrams ?? 0)}
          </p>
          <p className="mt-1 text-sm text-muted">
            Free gold in Personal: {formatGrams(personal?.balances.goldGrams ?? 0)}
          </p>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <Field label="Grams to contribute">
              <input
                className={inputClass}
                type="number"
                value={grams}
                onChange={(e) => setGrams(e.target.value)}
              />
            </Field>
            <PrimaryButton onClick={contribute} disabled={!practiceEnabled}>
              Move to vault
            </PrimaryButton>
          </div>
          <p className="mt-3 text-xs text-muted">
            Practice transfer only — not a custodial vault allocation.
          </p>
        </Panel>

        <Panel
          title="Mint · Redeem · Reserves"
          description="Live custody is not enabled yet"
        >
          <Notice tone="info">
            Coming soon — physical mint, redeem, and proof-of-reserve stay offline
            until certified vault partners go live. This demo never implies vaulted
            gold is held for your practice balance.
          </Notice>
          <div className="mt-4 grid gap-2">
            {["Mint against vault deposit", "Redeem to physical delivery", "Live proof of reserves"].map(
              (label) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-lg border border-dashed border-[var(--color-line)] px-4 py-3 text-sm"
                >
                  <span className="font-semibold text-heading">{label}</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
                    Coming soon
                  </span>
                </div>
              ),
            )}
          </div>
        </Panel>
      </div>

      <Panel title="How multi-wallet works">
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted">
          <li>Personal — everyday spending + metal pockets</li>
          <li>Business — company treasury with team roles</li>
          <li>Kids / Family — parent limits &amp; approvals</li>
          <li>Savings / Vault — lock metal away from spending (practice pocket)</li>
          <li>Switch wallets anytime from the sidebar switcher</li>
        </ul>
      </Panel>
    </AppPage>
  );
}
