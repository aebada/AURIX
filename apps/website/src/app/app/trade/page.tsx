"use client";

import { useEffect, useState } from "react";
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
import { getPracticePriceProvider } from "@/lib/app/price-provider";
import { useMetalQuotes } from "@/lib/metal-quotes";
import { useAuth } from "@/lib/auth-context";

type CheckoutCfg = {
  stripe: boolean;
  paypal: boolean;
  liveCustody: false;
};

export default function TradePage() {
  const { user } = useAuth();
  const { activeWallet, buy, sell, practiceEnabled } = usePractice();
  const { gold, silver, live } = useMetalQuotes("EUR");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [metal, setMetal] = useState<Metal>("gold");
  const [amount, setAmount] = useState("50");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [payBusy, setPayBusy] = useState(false);
  const [checkout, setCheckout] = useState<CheckoutCfg | null>(null);

  useEffect(() => {
    if (user?.email && !email) setEmail(user.email);
  }, [user, email]);

  useEffect(() => {
    fetch("/auth/checkout-config.php", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: CheckoutCfg | null) => {
        if (data) setCheckout(data);
      })
      .catch(() => undefined);
  }, []);

  const mockQuote = getPracticePriceProvider().getQuote(metal);
  const liveGram = metal === "gold" ? gold?.pricePerGram : silver?.pricePerGram;
  const price = liveGram ?? mockQuote.pricePerGram;
  const quote = liveGram
    ? {
        ...mockQuote,
        pricePerGram: liveGram,
        kind: "indicative_spot" as const,
        source: gold?.source ?? "gold-api.com",
      }
    : mockQuote;
  const n = Number(amount) || 0;
  const fee =
    side === "buy"
      ? n * PRACTICE_PRICES.feeRate
      : n * price * PRACTICE_PRICES.feeRate;
  const gramsEst = side === "buy" && price > 0 ? (n * (1 - PRACTICE_PRICES.feeRate)) / price : n;
  const total = side === "buy" ? n + fee : n * price - fee;
  const canPay = Boolean(checkout?.stripe || checkout?.paypal);

  async function pay(provider: "stripe" | "paypal") {
    setMsg(null);
    setErr(null);
    if (side !== "buy") {
      setErr("Card checkout is buy-only.");
      return;
    }
    if (!(n >= 10 && n <= 10000)) {
      setErr("Pay €10–€10,000.");
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr("Enter a valid email for the receipt.");
      return;
    }
    setPayBusy(true);
    try {
      const res = await fetch("/auth/checkout-create.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          metal,
          fiatEur: n,
          pricePerGram: price,
          email,
        }),
      });
      const data = (await res.json()) as { checkoutUrl?: string; error?: string };
      if (!res.ok || !data.checkoutUrl) {
        setErr(data.error ?? "Checkout is not available yet.");
        return;
      }
      window.location.href = data.checkoutUrl;
    } catch {
      setErr("Checkout unavailable.");
    } finally {
      setPayBusy(false);
    }
  }

  function submit() {
    setMsg(null);
    setErr(null);
    const error = side === "buy" ? buy(metal, n) : sell(metal, n);
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
    <AppPage
      title="Order gold & silver"
      subtitle="Pay now at the live indicative quote. Vault allocation stays pending certification."
    >
      {err && <Notice tone="err">{err}</Notice>}
      {msg && <Notice tone="ok">{msg}</Notice>}
      <Notice tone="info">
        Paying by card reserves grams at this quote. It is not London vaulted metal
        and not a BPC mint until custody is certified.
      </Notice>

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

          <Field label={side === "buy" ? "Amount to pay (EUR)" : "Grams to sell"}>
            <input
              className={inputClass}
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Field>

          {side === "buy" ? (
            <Field label="Email for receipt (optional)">
              <input
                className={inputClass}
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </Field>
          ) : null}

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">
                {live ? "Indicative London spot" : "Practice / indicative quote"}
              </dt>
              <dd className="font-semibold">{formatEur(price)} / g</dd>
            </div>
            {side === "buy" ? (
              <div className="flex justify-between">
                <dt className="text-muted">Est. grams (after 0.5% fee)</dt>
                <dd>{formatGrams(gramsEst)}</dd>
              </div>
            ) : null}
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

          <div className="mt-6 flex flex-wrap gap-3">
            {side === "buy" && checkout?.stripe ? (
              <PrimaryButton onClick={() => void pay("stripe")} disabled={payBusy || n < 10}>
                {payBusy ? "Opening Stripe…" : "Pay with card"}
              </PrimaryButton>
            ) : null}
            {side === "buy" && checkout?.paypal ? (
              <SecondaryButton onClick={() => void pay("paypal")} disabled={payBusy || n < 10}>
                Pay with PayPal
              </SecondaryButton>
            ) : null}
            {side === "buy" && !canPay ? (
              <PrimaryButton disabled>
                Card checkout loading…
              </PrimaryButton>
            ) : null}
            <SecondaryButton onClick={submit} disabled={!practiceEnabled || n <= 0}>
              Practice fill
            </SecondaryButton>
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
          <p className="mt-4 text-xs text-muted">
            Pocket balances above are practice unless you paid by card. Paid
            reservations are recorded on the server, not in this browser wallet.
          </p>
        </Panel>
      </div>
    </AppPage>
  );
}
