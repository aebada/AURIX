import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { Card, StatusBadge } from "@/components/Card";
import { transactions } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Transactions" };

export default function TransactionsPage() {
  return (
    <>
      <Topbar title="Transactions" />
      <main className="flex-1 p-6 lg:p-10">
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-line)] text-xs uppercase tracking-wider text-muted">
                  <th className="py-2 font-semibold">Date</th>
                  <th className="py-2 font-semibold">Type</th>
                  <th className="py-2 font-semibold">Asset</th>
                  <th className="py-2 font-semibold">Amount</th>
                  <th className="py-2 font-semibold">Status</th>
                  <th className="py-2 font-semibold">Partner reference</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-b border-[var(--color-line)] last:border-0">
                    <td className="py-3 text-muted">{t.date}</td>
                    <td className="py-3 font-medium text-navy">{t.type}</td>
                    <td className="py-3 text-muted">{t.asset}</td>
                    <td className="py-3 font-semibold text-navy">{t.amount}</td>
                    <td className="py-3">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="py-3 font-mono text-xs text-muted">{t.reference}</td>
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
