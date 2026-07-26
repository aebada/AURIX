import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { Card } from "@/components/Card";
import { kycQueue } from "@/lib/mock-data";

export const metadata: Metadata = { title: "KYC Queue" };

export default function KycQueuePage() {
  return (
    <>
      <Topbar title="KYC Queue" />
      <main className="flex-1 p-6 lg:p-10">
        <Card>
          <p className="text-sm font-bold text-navy">Pending review</p>
          <p className="mt-1 text-sm text-muted">
            In production this reflects results from a licensed KYC
            provider (SumSub / Onfido / Veriff / Persona) — approve/reject
            here never performs verification itself.
          </p>
          <div className="mt-4 divide-y divide-[var(--color-line)]">
            {kycQueue.length === 0 && (
              <p className="py-6 text-sm text-muted">Nothing pending.</p>
            )}
            {kycQueue.map((u) => (
              <div key={u.id} className="flex items-center justify-between py-4">
                <div>
                  <p className="text-sm font-semibold text-navy">{u.fullName}</p>
                  <p className="text-xs text-muted">{u.email}</p>
                </div>
                <div className="flex gap-2">
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
