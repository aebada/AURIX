"use client";

import { useEffect, useState } from "react";
import { AppPage } from "@/components/app/AppShell";
import { Notice, Panel } from "@/components/app/chrome";

export default function CheckoutReturnPage() {
  const [msg, setMsg] = useState("Confirming payment…");
  const [err, setErr] = useState<string | null>(null);

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
            "Payment received. This is a fiat reservation only — metal is not vaulted or minted until custody is certified.",
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
        if (!res.ok) {
          setErr("Stripe confirmation failed.");
          return;
        }
        setMsg(
          "Payment received. This is a fiat reservation only — metal is not vaulted or minted until custody is certified.",
        );
        return;
      }
      setErr("Missing checkout return parameters.");
    }
    void run();
  }, []);

  return (
    <AppPage title="Checkout" subtitle="Fiat reservation — not a live gold order">
      {err ? <Notice tone="err">{err}</Notice> : <Notice tone="ok">{msg}</Notice>}
      <Panel title="What happens next">
        <p className="text-sm text-muted">
          Allocation stays pending certification. Practice balances on Buy / Sell are
          separate and still simulated.
        </p>
      </Panel>
    </AppPage>
  );
}
