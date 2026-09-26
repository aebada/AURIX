"use client";

import { useState } from "react";
import { Topbar } from "@/components/Topbar";
import { Card } from "@/components/Card";

const CORRIDORS = ["SA-EG", "AE-EG", "KW-EG", "QA-EG", "AE-SA", "SA-AE"];

export default function SettingsPage() {
  const [reserveLive, setReserveLive] = useState(false);
  const [corridors, setCorridors] = useState<Record<string, boolean>>(
    Object.fromEntries(CORRIDORS.map((c) => [c, false])),
  );

  return (
    <>
      <Topbar title="Settings / feature flags" />
      <main className="flex-1 space-y-6 p-6 lg:p-10">
        <Card>
          <p className="text-sm font-bold text-navy">RESERVE_LIVE</p>
          <p className="mt-1 text-sm text-muted">
            When false, mint/redeem and vault claims stay in certification. Do not enable without
            signed custody.
          </p>
          <label className="mt-4 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={reserveLive}
              onChange={(e) => setReserveLive(e.target.checked)}
            />
            Enable live reserves (admin UI only — wire to backend before production use)
          </label>
          <p className="mt-2 text-xs text-muted">Current: {String(reserveLive)}</p>
        </Card>
        <Card>
          <p className="text-sm font-bold text-navy">CROSS_BORDER_LIVE (per corridor)</p>
          <p className="mt-1 text-sm text-muted">
            Remittance/money-service licensing required before any corridor goes true.
          </p>
          <ul className="mt-4 space-y-2">
            {CORRIDORS.map((c) => (
              <li key={c}>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={corridors[c]}
                    onChange={(e) =>
                      setCorridors({ ...corridors, [c]: e.target.checked })
                    }
                  />
                  {c}
                </label>
              </li>
            ))}
          </ul>
        </Card>
      </main>
    </>
  );
}
