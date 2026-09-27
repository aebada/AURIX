"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/Topbar";
import { Card } from "@/components/Card";
import { adminApi, type FeatureFlagsState } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const CORRIDORS = ["SA-EG", "AE-EG", "KW-EG", "QA-EG", "AE-SA", "SA-AE"];

const emptyFlags: FeatureFlagsState = {
  RESERVE_LIVE: false,
  MAINTENANCE_MODE: false,
  CROSS_BORDER_LIVE: Object.fromEntries(CORRIDORS.map((c) => [c, false])),
  PAYROLL_BENEFIT_LIVE: { DE: false, AT: false },
};

export default function SettingsPage() {
  const { token, user } = useAuth();
  const [flags, setFlags] = useState<FeatureFlagsState>(emptyFlags);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const canEdit = user?.role === "super_admin";

  useEffect(() => {
    if (!token) return;
    adminApi
      .featureFlags(token)
      .then((res) => setFlags(res.flags))
      .catch((e: Error) => setError(e.message));
  }, [token]);

  async function save() {
    if (!token || !canEdit) return;
    setSaved(false);
    try {
      const res = await adminApi.updateFeatureFlags(token, flags);
      setFlags(res.flags);
      setSaved(true);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    }
  }

  return (
    <>
      <Topbar title="Settings / feature flags" />
      <main className="flex-1 space-y-6 p-6 lg:p-10">
        {!canEdit ? (
          <p className="text-sm text-muted">
            View-only. Only <span className="font-semibold">super_admin</span> can
            change flags.
          </p>
        ) : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {saved ? <p className="text-sm text-emerald-700">Saved (mock store).</p> : null}

        <Card>
          <p className="text-sm font-bold text-navy">RESERVE_LIVE</p>
          <p className="mt-1 text-sm text-muted">
            When false, mint/redeem and vault claims stay in certification. Do not
            enable without signed custody.
          </p>
          <label className="mt-4 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              disabled={!canEdit}
              checked={flags.RESERVE_LIVE}
              onChange={(e) =>
                setFlags({ ...flags, RESERVE_LIVE: e.target.checked })
              }
            />
            Enable live reserves
          </label>
        </Card>

        <Card>
          <p className="text-sm font-bold text-navy">MAINTENANCE_MODE</p>
          <label className="mt-4 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              disabled={!canEdit}
              checked={flags.MAINTENANCE_MODE}
              onChange={(e) =>
                setFlags({ ...flags, MAINTENANCE_MODE: e.target.checked })
              }
            />
            Maintenance mode (blocks public form posts)
          </label>
        </Card>

        <Card>
          <p className="text-sm font-bold text-navy">CROSS_BORDER_LIVE (per corridor)</p>
          <p className="mt-1 text-sm text-muted">
            Remittance/money-service licensing required before any corridor goes
            true.
          </p>
          <ul className="mt-4 space-y-2">
            {CORRIDORS.map((c) => (
              <li key={c}>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    disabled={!canEdit}
                    checked={Boolean(flags.CROSS_BORDER_LIVE[c])}
                    onChange={(e) =>
                      setFlags({
                        ...flags,
                        CROSS_BORDER_LIVE: {
                          ...flags.CROSS_BORDER_LIVE,
                          [c]: e.target.checked,
                        },
                      })
                    }
                  />
                  {c}
                </label>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <p className="text-sm font-bold text-navy">PAYROLL_BENEFIT_LIVE (per country)</p>
          <p className="mt-1 text-sm text-muted">
            Germany and Austria only at launch. Live grants require legal sign-off
            and custody rails.
          </p>
          <ul className="mt-4 space-y-2">
            {(["DE", "AT"] as const).map((c) => (
              <li key={c}>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    disabled={!canEdit}
                    checked={flags.PAYROLL_BENEFIT_LIVE[c]}
                    onChange={(e) =>
                      setFlags({
                        ...flags,
                        PAYROLL_BENEFIT_LIVE: {
                          ...flags.PAYROLL_BENEFIT_LIVE,
                          [c]: e.target.checked,
                        },
                      })
                    }
                  />
                  {c}
                </label>
              </li>
            ))}
          </ul>
        </Card>

        {canEdit ? (
          <button
            type="button"
            onClick={() => void save()}
            className="rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white"
          >
            Save feature flags
          </button>
        ) : null}
      </main>
    </>
  );
}
