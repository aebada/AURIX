"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/Topbar";
import { Card } from "@/components/Card";
import { useAuth } from "@/lib/auth-context";
import { adminApi, ApiError } from "@/lib/api";

interface PendingUser {
  id: string;
  email: string;
  fullName: string;
}

export default function KycQueuePage() {
  const { token } = useAuth();
  const [pending, setPending] = useState<PendingUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    adminApi
      .kycQueue(token)
      .then((res) => setPending(res.pending))
      .catch((e) => setError(e instanceof ApiError ? e.message : "Failed to load KYC queue"));
  }, [token]);

  async function decide(userId: string, decision: "verified" | "rejected") {
    if (!token) return;
    setBusyId(userId);
    setError(null);
    try {
      await adminApi.kycDecision(token, userId, decision);
      setPending((prev) => prev.filter((u) => u.id !== userId));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to record decision");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <Topbar title="KYC Queue" />
      <main className="flex-1 p-6 lg:p-10">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <Card>
          <p className="text-sm font-bold text-navy">Pending review</p>
          <p className="mt-1 text-sm text-muted">
            In production this reflects results from a licensed KYC
            provider (SumSub / Onfido / Veriff / Persona) — approve/reject
            here never performs verification itself, it just sets the
            user&apos;s kycStatus directly.
          </p>
          <div className="mt-4 divide-y divide-[var(--color-line)]">
            {pending.length === 0 && (
              <p className="py-6 text-sm text-muted">Nothing pending.</p>
            )}
            {pending.map((u) => (
              <div key={u.id} className="flex items-center justify-between py-4">
                <div>
                  <p className="text-sm font-semibold text-navy">{u.fullName}</p>
                  <p className="text-xs text-muted">{u.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={busyId === u.id}
                    onClick={() => decide(u.id, "verified")}
                    className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={busyId === u.id}
                    onClick={() => decide(u.id, "rejected")}
                    className="rounded-full border border-[var(--color-line)] px-4 py-2 text-xs font-semibold text-navy disabled:opacity-50"
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
