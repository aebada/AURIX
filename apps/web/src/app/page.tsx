import { Topbar } from "@/components/Topbar";
import { Card, StatusBadge } from "@/components/Card";
import { portfolio, transactions } from "@/lib/mock-data";

export default function OverviewPage() {
  return (
    <>
      <Topbar title="Overview" />
      <main className="flex-1 space-y-8 p-6 lg:p-10">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Total portfolio value
            </p>
            <p className="mt-2 text-4xl font-extrabold tracking-tight text-navy">
              ${portfolio.totalUsd.toLocaleString()}
            </p>
            <p className="mt-1 text-sm font-semibold text-emerald-600">
              +{portfolio.changePctToday}% today
            </p>

            <div className="mt-6 flex h-3 w-full overflow-hidden rounded-full bg-[var(--color-paper)]">
              {portfolio.allocation.map((a) => (
                <div
                  key={a.asset}
                  style={{ width: `${a.pct}%`, backgroundColor: `var(${a.colorVar})` }}
                />
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {portfolio.allocation.map((a) => (
                <div key={a.asset} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: `var(${a.colorVar})` }}
                  />
                  <span className="text-xs font-medium text-muted">
                    {a.asset} · {a.pct}%
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Reconciliation status
            </p>
            <p className="mt-3 text-2xl font-extrabold tracking-tight text-navy">
              1:1 reserve match
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              All issued balances reconcile against partner-reported vault
              reserves. See docs/PRODUCT_PLAN.md &ldquo;Continuous
              Proof-of-Reserve&rdquo;.
            </p>
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-navy">Recent transactions</p>
            <a href="/transactions" className="text-sm font-semibold text-gold-dark hover:underline">
              View all
            </a>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-line)] text-xs uppercase tracking-wider text-muted">
                  <th className="py-2 font-semibold">Date</th>
                  <th className="py-2 font-semibold">Type</th>
                  <th className="py-2 font-semibold">Asset</th>
                  <th className="py-2 font-semibold">Amount</th>
                  <th className="py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 4).map((t) => (
                  <tr key={t.id} className="border-b border-[var(--color-line)] last:border-0">
                    <td className="py-3 text-muted">{t.date}</td>
                    <td className="py-3 font-medium text-navy">{t.type}</td>
                    <td className="py-3 text-muted">{t.asset}</td>
                    <td className="py-3 font-semibold text-navy">{t.amount}</td>
                    <td className="py-3">
                      <StatusBadge status={t.status} />
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
