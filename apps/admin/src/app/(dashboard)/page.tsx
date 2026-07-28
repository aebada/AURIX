"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/Topbar";
import { Card, RiskBadge } from "@/components/Card";
import { flaggedTransactions, opsSummary } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import { adminApi, ApiError } from "@/lib/api";

export default function OverviewPage() {
  const { token } = useAuth();
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [pendingKyc, setPendingKyc] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    Promise.all([adminApi.users(token), adminApi.kycQueue(token)])
      .then(([usersRes, kycRes]) => {
        setTotalUsers(usersRes.users.length);
        setPendingKyc(kycRes.pending.length);
      })
      .catch((e) => setError(e instanceof ApiError ? e.message : "Failed to load overview"));
  }, [token]);

  return (
    <>
      <Topbar title="Overview" />
      <main className="flex-1 space-y-8 p-6 lg:p-10">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Total users</p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-navy">
              {totalUsers === null ? "…" : totalUsers.toLocaleString()}
            </p>
          </Card>
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Pending KYC</p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-navy">
              {pendingKyc === null ? "…" : pendingKyc}
            </p>
          </Card>
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Flagged transactions</p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-navy">
              {opsSummary.flaggedTransactions}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-muted">Mock — no fraud engine yet</p>
          </Card>
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Reserve status</p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-emerald-600">
              {opsSummary.reserveStatus}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-muted">Mock — no vault feed yet</p>
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
