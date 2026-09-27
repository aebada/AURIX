"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/Topbar";
import { Card } from "@/components/Card";
import { adminApi, type WaitlistEntry } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function WaitlistAdminPage() {
  const { token } = useAuth();
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    adminApi
      .waitlist(token)
      .then((res) => setEntries(res.entries))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <>
      <Topbar title="Waitlist" />
      <main className="flex-1 space-y-6 p-6 lg:p-10">
        <Card>
          <p className="text-sm text-muted">
            Public `/waitlist` and payroll employer interest signups. Backend mock
            store resets on restart until Prisma is migrated.
          </p>
          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
          {loading ? (
            <p className="mt-4 text-sm text-muted">Loading…</p>
          ) : entries.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No entries yet.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-line)] text-xs uppercase tracking-wider text-muted">
                    <th className="py-2 pr-3">Name</th>
                    <th className="py-2 pr-3">Email</th>
                    <th className="py-2 pr-3">Country</th>
                    <th className="py-2 pr-3">Interests</th>
                    <th className="py-2">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e) => (
                    <tr key={e.id} className="border-b border-[var(--color-line)]">
                      <td className="py-2 pr-3 font-medium text-navy">{e.name}</td>
                      <td className="py-2 pr-3">{e.email}</td>
                      <td className="py-2 pr-3">{e.country}</td>
                      <td className="py-2 pr-3 text-muted">{e.interests.join(", ")}</td>
                      <td className="py-2 text-muted">
                        {new Date(e.createdAt).toLocaleString()}
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
