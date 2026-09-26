"use client";

import { useState } from "react";
import { PartnerShell } from "@/components/gold-service/PartnerShell";
import { useGoldService } from "@/lib/gold-service/store";

export default function PartnerRedeemPage() {
  const gs = useGoldService();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [result, setResult] = useState<{
    ok: boolean;
    message: string;
    commission?: number;
  } | null>(null);

  function onRedeem(e: React.FormEvent) {
    e.preventDefault();
    if (!gs.state.partnerSession) {
      setResult({ ok: false, message: "Turn on partner mode first." });
      return;
    }
    const res = gs.redeemTransfer(code, name);
    setResult({
      ok: res.ok,
      message: res.message,
      commission: res.commission,
    });
  }

  return (
    <PartnerShell title="Redeem">
      <p className="mb-6 max-w-xl text-sm text-muted">
        Enter the practice code from the customer tracker and match the government ID name to the
        recipient on the transfer. Name mismatch blocks redemption.
      </p>
      <form onSubmit={onRedeem} className="max-w-md space-y-4">
        <label className="block text-sm">
          <span className="font-semibold">Practice code</span>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="AX-XXXXXX"
            className="mt-1 w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-2 font-mono"
          />
        </label>
        <label className="block text-sm">
          <span className="font-semibold">Name on government ID</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-[var(--color-navy)] px-5 py-2.5 text-sm font-bold text-white"
        >
          Redeem (practice)
        </button>
      </form>
      {result ? (
        <div
          className={`mt-6 max-w-md rounded-2xl border px-4 py-3 text-sm ${
            result.ok
              ? "border-emerald-500/30 bg-emerald-500/10"
              : "border-red-500/30 bg-red-500/10"
          }`}
        >
          <p className="font-semibold">{result.message}</p>
          {result.ok && result.commission != null ? (
            <p className="mt-1 text-muted">
              Estimated partner commission: €{result.commission.toFixed(2)} (practice)
            </p>
          ) : null}
        </div>
      ) : null}
    </PartnerShell>
  );
}
