"use client";

import { PartnerShell } from "@/components/gold-service/PartnerShell";
import { useGoldService } from "@/lib/gold-service/store";

export default function PartnerInventoryPage() {
  const gs = useGoldService();
  const inbound = gs.state.transfers.filter(
    (t) => !["cancelled", "refunded"].includes(t.status),
  );

  return (
    <PartnerShell title="Inventory">
      <p className="mb-6 text-sm text-muted">
        Practice view of packages assigned to locations in this browser. No real metal inventory.
      </p>
      {inbound.length === 0 ? (
        <p className="text-sm text-muted">No transfers yet. Create one from /send/.</p>
      ) : (
        <ul className="space-y-3">
          {inbound.map((t) => (
            <li
              key={t.id}
              className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] px-4 py-3"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-bold text-heading">
                  {t.grams}g {t.metal}
                </p>
                <span className="text-xs font-semibold uppercase text-muted">{t.status}</span>
              </div>
              <p className="mt-1 text-sm text-muted">
                {t.locationName} · {t.recipientName} · {t.practiceCode}
              </p>
            </li>
          ))}
        </ul>
      )}
    </PartnerShell>
  );
}
