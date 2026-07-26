import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { Card, RiskBadge } from "@/components/Card";
import { flaggedTransactions } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Transaction Monitoring" };

export default function MonitoringPage() {
  return (
    <>
      <Topbar title="Transaction Monitoring" />
      <main className="flex-1 p-6 lg:p-10">
        <Card>
          <p className="text-sm font-bold text-navy">Flagged by risk engine</p>
          <p className="mt-1 text-sm text-muted">
            Risk scores come from services/ai POST /fraud/score-transaction
            (rule-based mock, not a trained model) — see
            services/ai/README.md.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-line)] text-xs uppercase tracking-wider text-muted">
                  <th className="py-2 font-semibold">User</th>
                  <th className="py-2 font-semibold">Reason</th>
                  <th className="py-2 font-semibold">Amount</th>
                  <th className="py-2 font-semibold">Risk</th>
                  <th className="py-2 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {flaggedTransactions.map((t) => (
                  <tr key={t.id} className="border-b border-[var(--color-line)] last:border-0">
                    <td className="py-3 font-medium text-navy">{t.user}</td>
                    <td className="py-3 text-muted">{t.reason}</td>
                    <td className="py-3 font-semibold text-navy">{t.amount}</td>
                    <td className="py-3">
                      <RiskBadge score={t.riskScore} />
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        className="rounded-full border border-[var(--color-line)] px-3 py-1.5 text-xs font-semibold text-navy"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </>
  );
}
