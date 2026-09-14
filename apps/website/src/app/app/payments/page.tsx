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
import { formatEur, usePractice } from "@/lib/app/practice-store";

export default function PaymentsPage() {
  const {
    state,
    activeWallet,
    sendExternal,
    receiveExternal,
    transferBetweenWallets,
    practiceEnabled,
  } = usePractice();

  const [tab, setTab] = useState<"send" | "request" | "transfer" | "qr">(
    "send",
  );
  const [amount, setAmount] = useState("25");
  const [counterparty, setCounterparty] = useState("");
  const [toWallet, setToWallet] = useState(
    state.wallets.find((w) => w.id !== activeWallet.id)?.id ?? "",
  );
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  function run() {
    setMsg(null);
    setErr(null);
    const n = Number(amount) || 0;
    let error: string | null = null;
    if (tab === "send") {
      error = sendExternal(n, counterparty || "Contact");
    } else if (tab === "request") {
      error = receiveExternal(n, counterparty || "Contact");
    } else if (tab === "transfer") {
      error = transferBetweenWallets(activeWallet.id, toWallet, n);
    } else {
      setMsg(
        "QR / NFC are web previews — use Send, Request, or Between wallets for practice EUR.",
      );
      return;
    }
    if (error) setErr(error);
    else {
      setMsg("Practice payment recorded — no real money moved.");
      setAmount("");
    }
  }

  return (
    <AppPage
      title="Payments"
      subtitle="Send, request, QR-style preview, and between-wallet transfers"
    >
      {err && <Notice tone="err">{err}</Notice>}
      {msg && <Notice tone="ok">{msg}</Notice>}

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Payment actions" className="lg:col-span-2">
          <div className="mb-5 flex flex-wrap gap-2">
            {(
              [
                ["send", "Send"],
                ["request", "Request"],
                ["transfer", "Between wallets"],
                ["qr", "QR / link"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-semibold ${
                  tab === key
                    ? "border-navy bg-navy text-white"
                    : "border-[var(--color-line)] text-heading"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "qr" ? (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="flex h-44 w-44 items-center justify-center rounded-2xl border-2 border-gold bg-[var(--color-paper)] font-mono text-xs text-muted">
                AURIX · {activeWallet.id.slice(0, 8)}
              </div>
              <p className="max-w-sm text-center text-sm text-muted">
                Conceptual QR / tap-to-pay. Simulate a practice receive below — no
                live rails fire.
              </p>
              <PrimaryButton
                onClick={() => {
                  setMsg(null);
                  setErr(null);
                  const error = receiveExternal(Number(amount) || 25, "QR payee");
                  if (error) setErr(error);
                  else setMsg("Simulated QR receive — practice EUR only.");
                }}
                disabled={!practiceEnabled}
              >
                Simulate QR receive ({formatEur(Number(amount) || 25)})
              </PrimaryButton>
            </div>
          ) : (
            <div className="space-y-4">
              <Field label="Amount (EUR)">
                <input
                  className={inputClass}
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Field>
              {tab === "transfer" ? (
                <Field label="To wallet">
                  <select
                    className={inputClass}
                    value={toWallet}
                    onChange={(e) => setToWallet(e.target.value)}
                  >
                    {state.wallets
                      .filter((w) => w.id !== activeWallet.id)
                      .map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name}
                        </option>
                      ))}
                  </select>
                </Field>
              ) : (
                <Field
                  label={tab === "send" ? "Recipient label" : "From label"}
                >
                  <input
                    className={inputClass}
                    value={counterparty}
                    onChange={(e) => setCounterparty(e.target.value)}
                    placeholder="Name or email"
                  />
                </Field>
              )}
              <PrimaryButton
                onClick={run}
                disabled={!practiceEnabled || !(Number(amount) > 0)}
              >
                {tab === "send"
                  ? "Send practice payment"
                  : tab === "request"
                    ? "Simulate receive"
                    : "Transfer between wallets"}
              </PrimaryButton>
            </div>
          )}
        </Panel>

        <Panel title="Available fiat" description={activeWallet.name}>
          <p className="text-3xl font-extrabold tracking-tight text-heading">
            {formatEur(activeWallet.balances.fiatEur)}
          </p>
          <p className="mt-3 text-sm text-muted">
            Transfers between your own wallets (Personal ↔ Business ↔ Kids ↔
            Vault) are instant in practice mode.
          </p>
        </Panel>
      </div>
    </AppPage>
  );
}
