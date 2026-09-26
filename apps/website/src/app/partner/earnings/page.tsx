"use client";

import { PartnerShell } from "@/components/gold-service/PartnerShell";
import { estimateFees, useGoldService } from "@/lib/gold-service/store";

export default function PartnerEarningsPage() {
  const gs = useGoldService();
  const completed = gs.state.transfers.filter((t) => t.status === "completed");

  let total = 0;
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
    total += commission;
    return { t, commission };
  });

  return (
    <PartnerShell title="Earnings">
      <p className="mb-6 text-sm text-muted">
        Estimated practice commissions from completed redemptions in this browser.
      </p>
      <div className="mb-6 rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
        <p className="text-xs font-bold uppercase text-muted">Practice total</p>
        <p className="mt-2 text-3xl font-extrabold text-heading">€{total.toFixed(2)}</p>
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-muted">No completed redemptions yet.</p>
      ) : (
        <ul className="space-y-2">
          {rows.map(({ t, commission }) => (
            <li
              key={t.id}
              className="flex items-center justify-between rounded-xl border border-[var(--color-line)] px-4 py-2 text-sm"
            >
              <span>
                {t.id.slice(0, 18)}… · {t.grams}g {t.metal}
              </span>
              <span className="font-bold">€{commission.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </PartnerShell>
  );
}
