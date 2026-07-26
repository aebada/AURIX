import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { Card, StatusBadge } from "@/components/Card";
import { governanceProposals } from "@/lib/mock-data";

export const metadata: Metadata = { title: "AI Governance" };

export default function GovernancePage() {
  return (
    <>
      <Topbar title="AI Governance" />
      <main className="flex-1 p-6 lg:p-10">
        <Card className="mb-6 border-gold/30">
          <p className="text-sm font-bold text-navy">A hard rule, not a detail</p>
          <p className="mt-1 text-sm text-muted">
            AI can recommend and score proposals, but final approval for
            funds, allocations, reserve logic, and compliance changes
            always requires a human decision here. See
            docs/PRODUCT_PLAN.md section 4.
          </p>
        </Card>

        <Card>
          <p className="text-sm font-bold text-navy">Proposals awaiting review</p>
          <div className="mt-4 divide-y divide-[var(--color-line)]">
            {governanceProposals.map((p) => (
              <div key={p.id} className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-navy">{p.title}</p>
                    <p className="mt-1 text-xs text-muted">
                      AI recommendation: {p.aiRecommendation} (score {p.aiScore.toFixed(2)})
                    </p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-[var(--color-line)] px-4 py-2 text-xs font-semibold text-navy"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </>
  );
}
