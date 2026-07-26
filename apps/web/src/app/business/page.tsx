import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { Card } from "@/components/Card";
import { businessWallets } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Business" };

export default function BusinessPage() {
  return (
    <>
      <Topbar title="Business" />
      <main className="flex-1 space-y-6 p-6 lg:p-10">
        <Card>
          <p className="text-sm font-bold text-navy">Company wallets</p>
          <p className="mt-1 text-sm text-muted">
            Multi-user business wallets with role-based access. Mock data —
            no real multi-user permissions are enforced yet.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {businessWallets.map((w) => (
              <div
                key={w.id}
                className="rounded-2xl border border-[var(--color-line)] p-5"
              >
                <p className="text-sm font-semibold text-navy">{w.name}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted">
                  Role: {w.role}
                </p>
                <p className="mt-4 text-2xl font-extrabold tracking-tight text-navy">
                  ${w.balanceUsd.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-sm font-bold text-navy">Invoicing &amp; payroll</p>
          <p className="mt-1 text-sm text-muted">
            Not implemented yet — planned per docs/PRODUCT_PLAN.md section
            3.3 (merchant tools, business reporting).
          </p>
        </Card>
      </main>
    </>
  );
}
