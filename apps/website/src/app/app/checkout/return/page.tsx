"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppPage } from "@/components/app/AppShell";
import { Notice, Panel, PrimaryButton, SecondaryButton } from "@/components/app/chrome";

export default function CheckoutReturnPage() {
  const [msg, setMsg] = useState("Confirming payment…");
  const [err, setErr] = useState<string | null>(null);
  const [grams, setGrams] = useState<number | null>(null);
  const [bpc, setBpc] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const provider = params.get("provider");
    const order = params.get("order");
    const sessionId = params.get("session_id");
    const paypalOk = params.get("ok");

    async function run() {
      if (provider === "paypal") {
        if (paypalOk === "1") {
          setMsg(
            "Payment received. BPC was minted to your internal AURIX account. This is not an attested London vault.",
          );
        } else {
          setErr("PayPal confirmation failed or was cancelled.");
        }
        return;
      }
      if (provider === "stripe" && order && sessionId) {
        const res = await fetch("/auth/checkout-stripe-confirm.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: order, sessionId }),
        });
        const data = (await res.json().catch(() => null)) as {
          grams?: number;
          bpc?: number;
          status?: string;
        } | null;
        if (!res.ok) {
          setErr("Stripe confirmation failed.");
          return;
        }
        if (typeof data?.grams === "number") setGrams(data.grams);
        if (typeof data?.bpc === "number") setBpc(data.bpc);
        setMsg(
          data?.status === "minted"
            ? "Payment confirmed and BPC minted to your internal reserve account."
            : "Payment received. Open Dashboard to see your account.",
        );
        return;
      }
      setErr("Missing checkout return parameters.");
    }
    void run();
  }, []);

  return (
    <AppPage title="Checkout" subtitle="Payment → internal BPC mint">
      {err ? <Notice tone="err">{err}</Notice> : <Notice tone="ok">{msg}</Notice>}
      {(grams != null || bpc != null) && (
        <Panel title="Minted">
          <p className="text-sm text-heading">
            {grams != null ? `${grams} g` : ""}
            {bpc != null ? ` · ${bpc.toLocaleString()} BPC` : ""}
          </p>
        </Panel>
      )}
      <Panel title="Next">
        <p className="mb-4 text-sm text-muted">
          View balances under Accounts. London vault attestation stays off until a
          custodian is signed.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href="/app/">
            <PrimaryButton>Open dashboard</PrimaryButton>
          </Link>
          <Link href="/app/transactions/">
            <SecondaryButton>Transactions</SecondaryButton>
          </Link>
        </div>
      </Panel>
    </AppPage>
  );
}
