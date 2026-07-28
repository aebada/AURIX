import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { Card, StatusBadge } from "@/components/Card";
import { partnerHealth } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Partner Health" };

export default function PartnerHealthPage() {
  return (
    <>
      <Topbar title="Partner Health" />
      <main className="flex-1 p-6 lg:p-10">
        <Card>
          <p className="text-sm font-bold text-navy">API & reserve partner status</p>
          <p className="mt-1 text-sm text-muted">
            Reserve/allocation visibility from partner APIs (see
            docs/PRODUCT_PLAN.md 5.8). Not a real health check yet.
          </p>
          <div className="mt-4 divide-y divide-[var(--color-line)]">
            {partnerHealth.map((p) => (
              <div key={p.name} className="flex items-center justify-between py-4">
                <div>
                  <p className="text-sm font-semibold text-navy">{p.name}</p>
                  <p className="text-xs text-muted">{p.category}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted">{p.lastChecked}</span>
                  <StatusBadge status={p.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </>
  );
}
