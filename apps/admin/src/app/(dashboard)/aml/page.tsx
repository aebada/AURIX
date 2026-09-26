"use client";

import { Topbar } from "@/components/Topbar";
import { Card } from "@/components/Card";

const FLAGS = [
  {
    id: "aml_1",
    type: "sanctions_screen",
    transfer: "xfer_demo_1",
    status: "cleared",
    note: "No hit (practice)",
  },
  {
    id: "aml_2",
    type: "name_mismatch",
    transfer: "xfer_demo_2",
    status: "open",
    note: "Recipient ID name differed on first attempt (practice)",
  },
];

export default function AmlPage() {
  return (
    <>
      <Topbar title="AML / screening" />
      <main className="flex-1 p-6 lg:p-10">
        <Card>
          <p className="text-sm font-bold text-navy">Cases</p>
          <p className="mt-1 text-sm text-muted">
            Stub queue for compliance_officer. Wire to screening vendor before live corridors.
          </p>
          <div className="mt-4 divide-y divide-[var(--color-line)]">
            {FLAGS.map((f) => (
              <div key={f.id} className="py-3 text-sm">
                <p className="font-semibold text-navy">
                  {f.type} · {f.transfer}
                </p>
                <p className="text-xs text-muted">
                  {f.status} — {f.note}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </>
  );
}
