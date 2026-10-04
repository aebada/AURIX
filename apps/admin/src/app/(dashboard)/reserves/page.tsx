"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { AdminPage } from "@/components/AdminPage";
import { adminApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function ReservesPage() {
  const { token } = useAuth();
  const [note, setNote] = useState("Practice custody report only.");
  const [reserveLive, setReserveLive] = useState(false);
  const [gold, setGold] = useState(0);
  const [silver, setSilver] = useState(0);
  const [asOf, setAsOf] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    adminApi
      .metalReserves(token)
      .then((res) => {
        setReserveLive(res.reserveLive);
        setGold(res.report.goldGrams);
        setSilver(res.report.silverGrams);
        setAsOf(res.report.asOf);
        setNote(res.report.note);
      })
      .catch((e: Error) => setError(e.message));
  }, [token]);

  return (
    <AdminPage
      title="Reserves"
      note="Hard gate: liveVault is always false until a signed London custodian and RESERVE_LIVE certification."
    >
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Card>
        <p className="text-sm font-bold text-navy">Mock custody report</p>
        <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-gold-dark">
          RESERVE_LIVE={String(reserveLive)} · liveVault=false
        </p>
        <p className="mt-3 text-sm text-muted">{note}</p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted">Gold (g)</dt>
            <dd className="font-bold text-navy">{gold}</dd>
          </div>
          <div>
            <dt className="text-muted">Silver (g)</dt>
            <dd className="font-bold text-navy">{silver}</dd>
          </div>
          <div>
            <dt className="text-muted">As of</dt>
            <dd className="font-bold text-navy">{asOf ? new Date(asOf).toLocaleString() : "—"}</dd>
          </div>
        </dl>
      </Card>
    </AdminPage>
  );
}
