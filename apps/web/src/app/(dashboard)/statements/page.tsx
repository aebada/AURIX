import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { Card } from "@/components/Card";
import { statements } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Statements" };

export default function StatementsPage() {
  return (
    <>
      <Topbar title="Statements" />
      <main className="flex-1 p-6 lg:p-10">
        <Card>
          <p className="text-sm font-bold text-navy">Monthly statements</p>
          <p className="mt-1 text-sm text-muted">
            Downloadable statements and tax exports. No real file generation
            is wired up yet — these are placeholder rows.
          </p>
          <div className="mt-6 divide-y divide-[var(--color-line)]">
            {statements.map((s) => (
              <div key={s.id} className="flex items-center justify-between py-4">
                <div>
                  <p className="text-sm font-semibold text-navy">{s.period}</p>
                  <p className="text-xs text-muted">{s.format}</p>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-[var(--color-line)] px-4 py-2 text-xs font-semibold text-navy transition-colors hover:border-navy"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </>
  );
}
