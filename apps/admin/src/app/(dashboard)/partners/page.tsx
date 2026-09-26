"use client";

import { useMemo, useState } from "react";
import { Topbar } from "@/components/Topbar";
import { Card, StatusBadge } from "@/components/Card";
import { partnerHealth } from "@/lib/mock-data";
import prospects from "@/lib/gold-prospects.json";

type Prospect = {
  id: string;
  name: string;
  country: string;
  city: string;
  type: string;
  email: string;
  website: string;
  status: string;
};

export default function PartnersAdminPage() {
  const [tab, setTab] = useState<"directory" | "health" | "rules">("directory");
  const list = prospects as Prospect[];
  const byCountry = useMemo(() => {
    const m: Record<string, number> = {};
    for (const p of list) m[p.country] = (m[p.country] || 0) + 1;
    return m;
  }, [list]);

  return (
    <>
      <Topbar title="Partners" />
      <main className="flex-1 p-6 lg:p-10 space-y-6">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["directory", "Directory & invites"],
              ["health", "API health"],
              ["rules", "Commission rules"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`rounded-full px-4 py-2 text-xs font-bold ${
                tab === id ? "bg-navy text-white" : "border border-[var(--color-line)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "directory" && (
          <Card>
            <p className="text-sm font-bold text-navy">Store prospects (SA / EG / KW / AE / QA)</p>
            <p className="mt-1 text-sm text-muted">
              {list.length} locations seeded from research CSV. Status remains prospect until
              KYB approval — not signed partners.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {Object.entries(byCountry).map(([c, n]) => (
                <span key={c} className="rounded-full bg-[var(--color-surface)] px-3 py-1">
                  {c}: {n}
                </span>
              ))}
            </div>
            <div className="mt-4 max-h-[480px] overflow-y-auto divide-y divide-[var(--color-line)]">
              {list.map((p) => (
                <div key={p.id} className="flex items-start justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-semibold text-navy">{p.name}</p>
                    <p className="text-xs text-muted">
                      {p.city}, {p.country} · {p.type}
                      {p.email ? ` · ${p.email}` : " · no public email"}
                    </p>
                  </div>
                  <StatusBadge status="pending" />
                </div>
              ))}
            </div>
          </Card>
        )}

        {tab === "health" && (
          <Card>
            <p className="text-sm font-bold text-navy">API & reserve partner status</p>
            <div className="mt-4 divide-y divide-[var(--color-line)]">
              {partnerHealth.map((p) => (
                <div key={p.name} className="flex items-center justify-between py-4">
                  <div>
                    <p className="text-sm font-semibold text-navy">{p.name}</p>
                    <p className="text-xs text-muted">{p.category}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              ))}
            </div>
          </Card>
        )}

        {tab === "rules" && (
          <Card>
            <p className="text-sm font-bold text-navy">Commission rules (configurable)</p>
            <p className="mt-1 text-sm text-muted">
              Starting recommendation from the build spec — confirm with finance before live
              corridors. Never hard-code production rates in client-only UI long-term.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>Default: 3.0% customer fee · €5 flat · 35% partner share</li>
              <li>SA: 2.8% · €6 flat · 35% share</li>
              <li>EG: 3.5% · €4 flat · 40% share</li>
            </ul>
          </Card>
        )}
      </main>
    </>
  );
}
