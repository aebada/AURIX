"use client";

import { useState } from "react";
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
    const r = gs.redeemTransfer(code, name);
    setResult({
      ok: r.ok,
      message: r.message,
      commission: r.commission,
    });
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-heading">Redeem</h1>
        <p className="mt-2 text-sm text-muted">
          Counter flow: enter code, check ID name match, complete, see commission immediately.
        </p>
      </div>

      <form
        onSubmit={onRedeem}
        className="space-y-4 rounded-3xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6"
      >
        <label className="block text-xs font-bold uppercase tracking-wider text-muted">
          Redemption code
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[var(--color-line)] px-4 py-3 text-lg font-bold tracking-widest"
            placeholder="AX-XXXXXX"
            required
          />
        </label>
        <label className="block text-xs font-bold uppercase tracking-wider text-muted">
          Name on government ID
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[var(--color-line)] px-4 py-3 text-sm"
            placeholder="Must match recipient name"
            required
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-full bg-[var(--color-navy)] py-4 text-sm font-extrabold text-white"
        >
          Complete redemption
        </button>
      </form>

      {result && (
        <div
          className={`rounded-2xl border p-5 text-sm ${
            result.ok
              ? "border-emerald-500/40 bg-emerald-500/10"
              : "border-red-500/40 bg-red-500/10"
          }`}
        >
          <div className="font-bold">{result.message}</div>
          {result.ok && result.commission != null && (
            <div className="mt-2">
              Partner commission (practice): <strong>€{result.commission.toFixed(2)}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
