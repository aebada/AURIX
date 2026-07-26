import { Topbar } from "@/components/Topbar";
import { Card, RiskBadge } from "@/components/Card";
import { flaggedTransactions, opsSummary } from "@/lib/mock-data";

export default function OverviewPage() {
  return (
    <>
      <Topbar title="Overview" />
      <main className="flex-1 space-y-8 p-6 lg:p-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Total users</p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-navy">
              {opsSummary.totalUsers.toLocaleString()}
            </p>
          </Card>
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Pending KYC</p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-navy">
              {opsSummary.pendingKyc}
            </p>
          </Card>
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Flagged transactions</p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-navy">
              {opsSummary.flaggedTransactions}
            </p>
          </Card>
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Reserve status</p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-emerald-600">
              {opsSummary.reserveStatus}
            </p>
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-navy">Recently flagged transactions</p>
            <a href="/monitoring" className="text-sm font-semibold text-gold-dark hover:underline">
              View all
            </a>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-line)] text-xs uppercase tracking-wider text-muted">
                  <th className="py-2 font-semibold">User</th>
                  <th className="py-2 font-semibold">Reason</th>
                  <th className="py-2 font-semibold">Amount</th>
                  <th className="py-2 font-semibold">Risk</th>
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
