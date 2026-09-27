"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/Topbar";
import { Card } from "@/components/Card";
import {
  adminApi,
  type InvestorInquiry,
  type InvestorPipelineStatus,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const STATUSES: InvestorPipelineStatus[] = [
  "new",
  "contacted",
  "in_diligence",
  "closed",
];

export default function InvestorsAdminPage() {
  const { token } = useAuth();
  const [inquiries, setInquiries] = useState<InvestorInquiry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!token) return;
    setLoading(true);
    try {
      const res = await adminApi.investors(token);
      setInquiries(res.inquiries);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function setStatus(id: string, status: InvestorPipelineStatus) {
    if (!token) return;
    try {
      const res = await adminApi.updateInvestorStatus(token, id, status);
      setInquiries((prev) =>
        prev.map((i) => (i.id === id ? res.inquiry : i)),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    }
  }

  return (
    <>
      <Topbar title="Investor pipeline" />
      <main className="flex-1 space-y-6 p-6 lg:p-10">
        <Card>
          <p className="text-sm text-muted">
            Pipeline from `/investors` inquiries. Status changes are audited
            server-side.
          </p>
          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
          {loading ? (
            <p className="mt-4 text-sm text-muted">Loading…</p>
          ) : inquiries.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No inquiries yet.</p>
          ) : (
            <ul className="mt-6 space-y-4">
              {inquiries.map((inq) => (
                <li
                  key={inq.id}
                  className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-navy">{inq.name}</p>
                      <p className="text-sm text-muted">
                        {inq.email}
                        {inq.firm ? ` · ${inq.firm}` : ""}
                        {inq.investorType ? ` · ${inq.investorType}` : ""}
                      </p>
                      <p className="mt-2 text-sm text-navy/80">{inq.message}</p>
                    </div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                      Status
                      <select
                        value={inq.status}
                        onChange={(e) =>
                          void setStatus(
                            inq.id,
                            e.target.value as InvestorPipelineStatus,
                          )
                        }
                        className="mt-1 block rounded-lg border border-[var(--color-line)] px-3 py-2 text-sm font-medium text-navy"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <p className="mt-2 text-xs text-muted">
                    {new Date(inq.createdAt).toLocaleString()}
                    {inq.checkSize ? ` · ${inq.checkSize}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </main>
    </>
  );
}
