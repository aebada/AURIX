"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { useGoldService } from "@/lib/gold-service/store";
import type { TransferStatus } from "@/lib/gold-service/types";

const FLOW: TransferStatus[] = [
  "paid",
  "notified",
  "verified",
  "ready",
  "out_for_delivery",
  "completed",
];

const LABELS: Record<TransferStatus, string> = {
  paid: "Paid (practice)",
  notified: "Partner notified",
  verified: "ID verified",
  ready: "Ready for pickup",
  out_for_delivery: "Out for delivery",
  completed: "Completed",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

function TrackInner() {
  const params = useSearchParams();
  const id = params.get("id") || "";
  const gs = useGoldService();
  const transfer = id ? gs.getTransfer(id) : undefined;

  if (!id) {
    return (
      <Container className="max-w-2xl py-10">
        <p className="text-sm text-muted">
          Add a transfer id in the URL, e.g.{" "}
          <code className="rounded bg-[var(--color-surface)] px-1">/track/?id=…</code>
        </p>
        <Link href="/send/" className="mt-4 inline-block text-sm font-bold text-navy underline dark:text-gold-light">
          Start a practice send →
        </Link>
      </Container>
    );
  }

  if (!transfer) {
    return (
      <Container className="max-w-2xl py-10">
        <p className="text-sm text-muted">
          No transfer found for <code className="rounded bg-[var(--color-surface)] px-1">{id}</code>.
          Practice data lives in this browser only.
        </p>
        <Link href="/send/" className="mt-4 inline-block text-sm font-bold text-navy underline dark:text-gold-light">
          Create a new practice transfer →
        </Link>
      </Container>
    );
  }

  const idx = FLOW.indexOf(transfer.status);
  const terminal = ["cancelled", "refunded", "completed"].includes(transfer.status);

  return (
    <Container className="max-w-2xl py-10">
      <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm">
        Practice tracker — not live settlement or custody.
      </div>

      <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-muted">Transfer</p>
        <h2 className="mt-1 text-xl font-extrabold text-heading">{transfer.id}</h2>
        <p className="mt-2 text-sm text-muted">
          {transfer.grams}g {transfer.metal} · {transfer.originCountry} → {transfer.destinationCountry} ·{" "}
          {transfer.fulfillment}
        </p>
        <p className="mt-1 text-sm text-ink">
          To: <strong>{transfer.recipientName}</strong> · {transfer.locationName}
        </p>
        <p className="mt-3 text-sm">
          Status:{" "}
          <span className="font-bold text-gold-dark">{LABELS[transfer.status]}</span>
        </p>
        <p className="mt-1 text-xs text-muted">
          Practice code (partner redeem):{" "}
          <code className="rounded bg-[var(--color-surface)] px-1.5 py-0.5 font-mono">
            {transfer.practiceCode}
          </code>
        </p>
      </div>

      <ol className="mt-8 space-y-3">
        {FLOW.map((s, i) => {
          const done = idx >= 0 && i <= idx && !["cancelled", "refunded"].includes(transfer.status);
          const hist = transfer.statusHistory.find((h) => h.status === s);
          return (
            <li
              key={s}
              className={`flex items-start gap-3 rounded-2xl border px-4 py-3 ${
                done
                  ? "border-gold-dark/40 bg-gold-dark/5"
                  : "border-[var(--color-line)] opacity-60"
              }`}
            >
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  done ? "bg-[var(--color-navy)] text-white" : "bg-[var(--color-surface)] text-muted"
                }`}
              >
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-bold text-heading">{LABELS[s]}</p>
                {hist ? (
                  <p className="text-xs text-muted">{new Date(hist.at).toLocaleString()}</p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>

      {transfer.statusHistory.some((h) => h.status === "cancelled" || h.status === "refunded") ? (
        <p className="mt-4 text-sm font-semibold text-red-700 dark:text-red-300">
          {LABELS[transfer.status]}
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        {!terminal && idx >= 0 && idx < FLOW.length - 1 ? (
          <button
            type="button"
            onClick={() => gs.advanceTransfer(transfer.id, FLOW[idx + 1])}
            className="rounded-full bg-[var(--color-navy)] px-4 py-2 text-sm font-bold text-white"
          >
            Advance status (practice)
          </button>
        ) : null}
        {!terminal && ["paid", "notified"].includes(transfer.status) ? (
          <button
            type="button"
            onClick={() => gs.cancelTransfer(transfer.id)}
            className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold"
          >
            Cancel
          </button>
        ) : null}
        <Link
          href="/partner/redeem/"
          className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold"
        >
          Partner redeem
        </Link>
        <Link href="/send/" className="rounded-full px-4 py-2 text-sm font-semibold text-muted underline">
          New send
        </Link>
      </div>
    </Container>
  );
}

export default function TrackPage() {
  return (
    <>
      <PageHero
        eyebrow="Gold as a Service"
        title="Track a transfer"
        description="Follow package-style status for a practice gold send. Data is stored in this browser only."
      />
      <Suspense fallback={<Container className="py-10 text-sm text-muted">Loading…</Container>}>
        <TrackInner />
      </Suspense>
    </>
  );
}
