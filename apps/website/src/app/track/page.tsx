"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { useGoldService } from "@/lib/gold-service/store";
import { useLanguage } from "@/lib/i18n/language-context";
import type { CrossBorderTransfer, TransferStatus } from "@/lib/gold-service/types";

const STEPS: TransferStatus[] = [
  "paid",
  "notified",
  "verified",
  "ready",
  "out_for_delivery",
  "completed",
];

function TrackInner() {
  const { t } = useLanguage();
  const p = t.pages.track;
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
        <p className="text-sm text-muted">{p.missingId}</p>
        <Link href="/send/" className="mt-4 inline-block text-gold-dark underline">
          {p.sendGold}
        </Link>
      </Container>
    );
  }

  if (!transfer) {
    return (
      <Container className="py-16">
        <p className="text-sm text-muted">{p.notFound}</p>
        <Link href="/send/" className="mt-4 inline-block text-gold-dark underline">
          {p.createPractice}
        </Link>
      </Container>
    );
  }

  const idx = STEPS.indexOf(transfer.status as TransferStatus);
  const terminal = ["cancelled", "refunded", "completed"].includes(transfer.status);
  const label = (s: string) =>
    (p.labels as Record<string, string>)[s] || s;

  return (
    <>
      <PageHero
        eyebrow={p.eyebrow}
        title={p.title.replace("{id}", transfer.id.slice(0, 14))}
        description={p.description}
      />
      <section className="border-b border-[var(--color-line)] py-12">
        <Container className="max-w-2xl space-y-8">
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm">
            {p.banner}{" "}
            <strong>{transfer.recipientName}</strong>. {p.bannerCode}
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
                  {label(s)}
                </li>
              );
            })}
          </ol>

          <div className="rounded-2xl border border-[var(--color-line)] p-5 text-sm space-y-2">
            <div>
              <span className="text-muted">{p.status}:</span>{" "}
              {label(transfer.status)}
            </div>
            <div>
              <span className="text-muted">{p.metal}:</span> {transfer.grams}g{" "}
              {transfer.metal}
            </div>
            <div>
              <span className="text-muted">{p.route}:</span> {transfer.originCountry} →{" "}
              {transfer.destinationCountry}
            </div>
            <div>
              <span className="text-muted">{p.location}:</span> {transfer.locationName}
            </div>
            <div>
              <span className="text-muted">{p.fulfillment}:</span> {transfer.fulfillment}
            </div>
            <div>
              <span className="text-muted">{p.totalPaid}:</span> €
              {transfer.feeBreakdown.total.toFixed(2)}
            </div>
            <div className="pt-2 border-t border-[var(--color-line)]">
              <span className="text-muted">{p.practiceCode}:</span>{" "}
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
                {p.resendNotify}
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
                {p.cancelRefund}
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
                {p.markReady}
              </button>
            )}
            <Link
              href="/partner/redeem/"
              className="rounded-full border border-gold-dark px-5 py-2 text-sm font-semibold text-gold-dark"
            >
              {p.openRedeem}
            </Link>
            <Link href="/send/" className="rounded-full border px-5 py-2 text-sm">
              {p.sendAnother}
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}

export default function TrackPage() {
  const { t } = useLanguage();
  return (
    <Suspense fallback={<div className="p-10 text-sm text-muted">{t.pages.track.loading}</div>}>
      <TrackInner />
    </Suspense>
  );
}
