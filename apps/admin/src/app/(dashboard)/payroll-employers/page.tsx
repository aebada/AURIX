"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/Topbar";
import { Card } from "@/components/Card";
import {
  adminApi,
  type PayrollEmployerApplication,
  type PayrollEmployerKybStatus,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function PayrollEmployersAdminPage() {
  const { token } = useAuth();
  const [employers, setEmployers] = useState<PayrollEmployerApplication[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    if (!token) return;
    setLoading(true);
    try {
      const res = await adminApi.payrollEmployers(token);
      setEmployers(res.employers);
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

  async function setStatus(id: string, kybStatus: PayrollEmployerKybStatus) {
    if (!token) return;
    setBusyId(id);
    try {
      await adminApi.updatePayrollEmployerKyb(token, id, kybStatus);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <Topbar title="Payroll employers" />
      <main className="flex-1 space-y-6 p-6 lg:p-10">
        <Card>
          <p className="text-sm text-muted">
            Company applications from{" "}
            <code className="text-xs">/for-business/payroll/apply</code>. KYB
            queue — review additionality attestation before approving. Live
            grants stay gated by{" "}
            <code className="text-xs">PAYROLL_BENEFIT_LIVE</code>.
          </p>
          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
          {loading ? (
            <p className="mt-4 text-sm text-muted">Loading…</p>
          ) : employers.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No applications yet.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[960px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-line)] text-xs uppercase tracking-wider text-muted">
                    <th className="py-2 pr-3">Company</th>
                    <th className="py-2 pr-3">Contact</th>
                    <th className="py-2 pr-3">Country</th>
                    <th className="py-2 pr-3">Employees</th>
                    <th className="py-2 pr-3">Attested</th>
                    <th className="py-2 pr-3">KYB</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employers.map((e) => (
                    <tr key={e.id} className="border-b border-[var(--color-line)] align-top">
                      <td className="py-3 pr-3">
                        <p className="font-medium text-navy">{e.companyLegalName}</p>
                        <p className="mt-0.5 text-xs text-muted">{e.registrationNumber}</p>
                        <p className="mt-0.5 text-xs text-muted">{e.address}</p>
                      </td>
                      <td className="py-3 pr-3">
                        <p>{e.contactName}</p>
                        <p className="text-xs text-muted">{e.contactEmail}</p>
                        <p className="text-xs text-muted">{e.contactPhone}</p>
                      </td>
                      <td className="py-3 pr-3">{e.country}</td>
                      <td className="py-3 pr-3">{e.employeeCount}</td>
                      <td className="py-3 pr-3 text-xs text-muted">
                        {e.additionalityAttested
                          ? new Date(e.additionalityAttestedAt).toLocaleString()
                          : "—"}
                      </td>
                      <td className="py-3 pr-3">
                        <span className="rounded-full bg-gold/15 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-gold-dark">
                          {e.kybStatus}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={busyId === e.id || e.kybStatus === "approved"}
                            onClick={() => void setStatus(e.id, "approved")}
                            className="rounded-lg bg-navy px-2.5 py-1 text-xs font-semibold text-white disabled:opacity-40"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            disabled={busyId === e.id || e.kybStatus === "rejected"}
                            onClick={() => void setStatus(e.id, "rejected")}
                            className="rounded-lg border border-[var(--color-line)] px-2.5 py-1 text-xs font-semibold text-navy disabled:opacity-40"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>
    </>
  );
}
