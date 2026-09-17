"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { useGoldService } from "@/lib/gold-service/store";
import type { CrossBorderTransfer, TransferStatus } from "@/lib/gold-service/types";

const STEPS: TransferStatus[] = [
  "paid",
  "notified",
  "verified",
  "ready",
  "out_for_delivery",
  "completed",
];

const LABELS: Record<string, string> = {
  paid: "Paid",
  notified: "Recipient notified",
  verified: "Verified",
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
  const [transfer, setTransfer] = useState<CrossBorderTransfer | undefined>();

  useEffect(() => {
    setTransfer(id ? gs.getTransfer(id) : undefined);
  }, [id, gs]);

  if (!id) {
    return (
      <Container className="py-16">
        <p className="text-sm text-muted">Missing transfer id. Start from Send gold.</p>
        <Link href="/send/" className="mt-4 inline-block text-gold-dark underline">
          Send gold
        </Link>
      </Container>
    );
  }

  if (!transfer) {
    return (
      <Container className="py-16">
        <p className="text-sm text-muted">
          Transfer not found in this browser. Practice transfers are stored locally.
        </p>
        <Link href="/send/" className="mt-4 inline-block text-gold-dark underline">
          Create a practice transfer
        </Link>
      </Container>
    );
  }

  const idx = STEPS.indexOf(transfer.status as TransferStatus);
  const terminal = ["cancelled", "refunded", "completed"].includes(transfer.status);

  return (
    <>
      <PageHero
        eyebrow="Tracking"
        title={`Transfer ${transfer.id.slice(0, 14)}…`}
        description="Shipment-style status for your gold transfer. Practice mode — not live settlement."
      />
      <section className="border-b border-[var(--color-line)] py-12">
        <Container className="max-w-2xl space-y-8">
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm">
            Practice transfer · recipient needs government photo ID matching{" "}
            <strong>{transfer.recipientName}</strong>. Redemption code is released only after
            phone confirmation in a live build — shown here for partner-panel practice.
          </div>

          <ol className="space-y-3">
            {STEPS.map((s, i) => {
              const done = idx >= i || transfer.status === "completed";
              const current = transfer.status === s;
              return (
                <li
                  key={s}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                    current
                      ? "border-gold-dark bg-gold-dark/10 font-bold"
                      : done
                        ? "border-[var(--color-line)] opacity-80"
                        : "border-[var(--color-line)] opacity-40"
                  }`}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-navy)] text-xs text-white">
                    {i + 1}
                  </span>
                  {LABELS[s]}
                </li>
              );
            })}
          </ol>

          <div className="rounded-2xl border border-[var(--color-line)] p-5 text-sm space-y-2">
            <div>
              <span className="text-muted">Status:</span> {LABELS[transfer.status] || transfer.status}
            </div>
            <div>
              <span className="text-muted">Metal:</span> {transfer.grams}g {transfer.metal}
            </div>
            <div>
              <span className="text-muted">Route:</span> {transfer.originCountry} →{" "}
              {transfer.destinationCountry}
            </div>
            <div>
              <span className="text-muted">Location:</span> {transfer.locationName}
            </div>
            <div>
              <span className="text-muted">Fulfillment:</span> {transfer.fulfillment}
            </div>
            <div>
              <span className="text-muted">Total paid (practice):</span> €
              {transfer.feeBreakdown.total.toFixed(2)}
            </div>
            <div className="pt-2 border-t border-[var(--color-line)]">
              <span className="text-muted">Practice code (partner redeem):</span>{" "}
              <code className="font-bold">{transfer.practiceCode}</code>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {!terminal && transfer.status === "paid" && (
              <button
                type="button"
                className="rounded-full bg-[var(--color-navy)] px-5 py-2 text-sm font-bold text-white"
                onClick={() => {
                  gs.advanceTransfer(transfer.id, "notified");
                  setTransfer(gs.getTransfer(transfer.id));
                }}
              >
                Resend recipient notification
              </button>
            )}
            {!terminal && ["paid", "notified"].includes(transfer.status) && (
              <button
                type="button"
                className="rounded-full border border-[var(--color-line)] px-5 py-2 text-sm font-semibold"
                onClick={() => {
                  gs.cancelTransfer(transfer.id);
                  setTransfer(gs.getTransfer(transfer.id));
                }}
              >
                Cancel & refund
              </button>
            )}
            {!terminal && transfer.status === "notified" && (
              <button
                type="button"
                className="rounded-full border px-5 py-2 text-sm"
                onClick={() => {
                  gs.advanceTransfer(transfer.id, "ready");
                  setTransfer(gs.getTransfer(transfer.id));
                }}
              >
                Mark ready for pickup (demo)
              </button>
            )}
            <Link
              href="/partner/redeem/"
              className="rounded-full border border-gold-dark px-5 py-2 text-sm font-semibold text-gold-dark"
            >
              Open partner redeem
            </Link>
            <Link href="/send/" className="rounded-full border px-5 py-2 text-sm">
              Send another
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="p-10 text-sm text-muted">Loading…</div>}>
      <TrackInner />
    </Suspense>
  );
}
