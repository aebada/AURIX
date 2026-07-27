import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { Card, StatusBadge } from "@/components/Card";
import { apiKeys, partnerConnections } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Partners & API" };

export default function PartnersPage() {
  return (
    <>
      <Topbar title="Partners & API" />
      <main className="flex-1 space-y-6 p-6 lg:p-10">
        <Card>
          <p className="text-sm font-bold text-navy">Partner connections</p>
          <p className="mt-1 text-sm text-muted">
            Vault, payment, market data, and compliance providers AURIX
            orchestrates. See docs/PRODUCT_PLAN.md section 5.
          </p>
          <div className="mt-4 divide-y divide-[var(--color-line)]">
            {partnerConnections.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-semibold text-navy">{p.name}</p>
                  <p className="text-xs text-muted">{p.category}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-navy">API keys</p>
            <button
              type="button"
              className="rounded-full bg-navy px-4 py-2 text-xs font-semibold text-white"
            >
              Generate key
            </button>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-line)] text-xs uppercase tracking-wider text-muted">
                  <th className="py-2 font-semibold">Label</th>
                  <th className="py-2 font-semibold">Scopes</th>
                  <th className="py-2 font-semibold">Created</th>
                  <th className="py-2 font-semibold">Last used</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((k) => (
                  <tr key={k.id} className="border-b border-[var(--color-line)] last:border-0">
                    <td className="py-3 font-medium text-navy">{k.label}</td>
                    <td className="py-3 font-mono text-xs text-muted">{k.scopes}</td>
                    <td className="py-3 text-muted">{k.createdAt}</td>
                    <td className="py-3 text-muted">{k.lastUsed}</td>
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
