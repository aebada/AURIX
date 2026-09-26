"use client";

import { useGoldService, estimateFees } from "@/lib/gold-service/store";

export default function PartnerEarningsPage() {
  const gs = useGoldService();
  const completed = gs.state.transfers.filter((t) => t.status === "completed");
  const rows = completed.map((t) => {
    const fees = estimateFees(
      t.metal,
      t.grams,
      t.destinationCountry,
      gs.state.commissionRules,
    );
    const commission = Math.max(
      fees.partnerFee,
      Math.round(fees.serviceFee * (fees.partnerSharePct / 100) * 100) / 100,
    );
    return { t, commission };
  });
  const total = rows.reduce((s, r) => s + r.commission, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-heading">Earnings</h1>
      <p className="text-sm text-muted">
        Per-transaction commission transparency. Rules are configurable (not hard-coded for
        production rates).
      </p>
      <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
        <div className="text-xs font-bold uppercase text-muted">Period total (practice)</div>
        <div className="mt-2 text-3xl font-extrabold">€{total.toFixed(2)}</div>
      </div>
      <ul className="space-y-2 text-sm">
        {rows.length === 0 && (
          <li className="text-muted">No completed redemptions yet.</li>
        )}
        {rows.map(({ t, commission }) => (
          <li
            key={t.id}
            className="flex justify-between rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-4 py-3"
          >
            <span>
              {t.recipientName} · {t.grams}g {t.metal}
            </span>
            <span className="font-bold">€{commission.toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div className="rounded-2xl border border-[var(--color-line)] p-4 text-xs text-muted">
        Active rules:{" "}
        {gs.state.commissionRules
          .map(
            (r) =>
              `${r.country}/${r.partnerType}: ${r.customerFeePct}% fee, €${r.partnerFlat} flat, ${r.partnerSharePct}% share`,
          )
          .join(" · ")}
      </div>
    </div>
  );
}
