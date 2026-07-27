"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/Topbar";
import { Card, StatusBadge } from "@/components/Card";
import { useAuth } from "@/lib/auth-context";
import { walletApi, ApiError, type Transaction } from "@/lib/api";

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function TransactionsPage() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    walletApi
      .transactions(token)
      .then((res) =>
        setTransactions(
          [...res.transactions].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
        ),
      )
      .catch((e) => setError(e instanceof ApiError ? e.message : "Failed to load transactions"));
  }, [token]);

  return (
    <>
      <Topbar title="Transactions" />
      <main className="flex-1 p-6 lg:p-10">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
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
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-muted">
                      No transactions yet.
                    </td>
                  </tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t.id} className="border-b border-[var(--color-line)] last:border-0">
                      <td className="py-3 text-muted">{new Date(t.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 font-medium text-navy">{capitalize(t.type)}</td>
                      <td className="py-3 text-muted">{t.asset}</td>
                      <td className="py-3 font-semibold text-navy">{t.amount}</td>
                      <td className="py-3">
                        <StatusBadge status={capitalize(t.status)} />
                      </td>
                      <td className="py-3 font-mono text-xs text-muted">
                        {t.partnerReference ?? "internal"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </>
  );
}
