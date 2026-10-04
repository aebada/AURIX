"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/Topbar";
import { Card } from "@/components/Card";
import { adminApi, type MetalOrder } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function MetalOrdersAdminPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<MetalOrder[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const [reserveLive, setReserveLive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    adminApi
      .metalOrders(token)
      .then((res) => {
        setOrders(res.orders);
        setNote(res.note);
        setReserveLive(res.reserveLive);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <>
      <Topbar title="Metal orders (practice)" />
      <main className="flex-1 space-y-6 p-6 lg:p-10">
        <Card>
          <p className="text-sm font-bold text-navy">Allocation queue</p>
          <p className="mt-1 text-sm text-muted">
            {note ??
              "Practice order machine (quoted → paid → allocated). Live mint and vault claims stay off."}
          </p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-gold-dark">
            RESERVE_LIVE={String(reserveLive)} · liveMint=false · POST /orders is practice-only
          </p>
          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
          {loading ? (
            <p className="mt-4 text-sm text-muted">Loading…</p>
          ) : orders.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No practice orders.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-line)] text-xs uppercase tracking-wider text-muted">
                    <th className="py-2 pr-3">Id</th>
                    <th className="py-2 pr-3">Status</th>
                    <th className="py-2 pr-3">Metal</th>
                    <th className="py-2 pr-3">Grams</th>
                    <th className="py-2 pr-3">Fiat</th>
                    <th className="py-2">Allocation</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-[var(--color-line)]">
                      <td className="py-2 pr-3 font-medium text-navy">{o.id}</td>
                      <td className="py-2 pr-3 font-bold uppercase text-gold-dark">
                        {o.status}
                      </td>
                      <td className="py-2 pr-3 capitalize">{o.metal}</td>
                      <td className="py-2 pr-3">{o.grams}</td>
                      <td className="py-2 pr-3">
                        {o.fiatAmount} {o.fiatCurrency}
                      </td>
                      <td className="py-2 text-muted">{o.custodyAllocationId ?? "—"}</td>
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
