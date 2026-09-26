"use client";

import { Topbar } from "@/components/Topbar";
import { Card } from "@/components/Card";

const SAMPLE = [
  {
    id: "xfer_demo_1",
    corridor: "SA-EG",
    status: "paid",
    metal: "gold 5g",
    recipient: "Practice recipient",
    live: false,
  },
  {
    id: "xfer_demo_2",
    corridor: "AE-EG",
    status: "ready",
    metal: "gold 1g",
    recipient: "Demo user",
    live: false,
  },
];

export default function TransfersPage() {
  return (
    <>
      <Topbar title="Cross-border transfers" />
      <main className="flex-1 p-6 lg:p-10">
        <Card>
          <p className="text-sm font-bold text-navy">Gold as a Service ledger</p>
          <p className="mt-1 text-sm text-muted">
            Practice / mock rows. Live settlement stays off until CROSS_BORDER_LIVE is enabled
            per corridor after licensing.
          </p>
          <div className="mt-4 divide-y divide-[var(--color-line)]">
            {SAMPLE.map((t) => (
              <div key={t.id} className="flex justify-between py-3 text-sm">
                <div>
                  <p className="font-semibold text-navy">{t.id}</p>
                  <p className="text-xs text-muted">
                    {t.corridor} · {t.metal} · {t.recipient}
                  </p>
                </div>
                <span className="text-xs font-bold uppercase text-gold-dark">{t.status}</span>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </>
  );
}
