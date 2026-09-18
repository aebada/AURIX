"use client";

import { useMemo, useState } from "react";
import pipeline from "@/lib/money2020-partner-pipeline.json";

type Contact = (typeof pipeline.contacts)[number];

const TRACKS: { id: string; label: string }[] = [
  { id: "", label: "All tracks" },
  { id: "capital", label: "Capital" },
  { id: "banking", label: "Banking" },
  { id: "payments", label: "Payments" },
  { id: "fintech", label: "Fintech" },
  { id: "compliance", label: "Compliance" },
  { id: "sponsor", label: "Sponsor" },
  { id: "media", label: "Media" },
];

export function Money2020PartnerPipeline() {
  const [track, setTrack] = useState("");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (pipeline.contacts as Contact[]).filter((c) => {
      if (track && c.track !== track) return false;
      if (!needle) return true;
      return (
        c.organization.toLowerCase().includes(needle) ||
        c.email.toLowerCase().includes(needle) ||
        c.roles.toLowerCase().includes(needle)
      );
    });
  }, [track, q]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100">
        Money20/20 Middle East outreach pipeline — {pipeline.count} organizations with{" "}
        <strong>verified public emails only</strong>. Listed as partnership prospects /
        invited — not signed AURIX commercial partners.
      </div>

      <div className="flex flex-wrap gap-2">
        {TRACKS.map((t) => (
          <button
            key={t.id || "all"}
            type="button"
            onClick={() => setTrack(t.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              track === t.id
                ? "bg-[var(--color-navy)] text-white"
                : "border border-[var(--color-line)] text-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search organization, email, or role"
        className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-4 py-3 text-sm"
      />

      <p className="text-xs text-muted">
        Showing {rows.length} · emails are profile-fitted by track (capital / banking /
        payments / …) and mailbox tone (IR / press / sales / …).
      </p>

      <div className="max-h-[560px] space-y-3 overflow-y-auto">
        {rows.map((c) => (
          <div
            key={`${c.organization}-${c.email}`}
            className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-extrabold text-heading">{c.organization}</div>
                <div className="mt-1 text-xs text-muted">
                  {c.roles} · {c.track} · {c.tone}
                </div>
                <div className="mt-2 text-sm">
                  <a
                    href={`mailto:${c.email}?subject=${encodeURIComponent(`AURIX partnership — ${c.organization}`)}`}
                    className="font-semibold text-gold-dark underline"
                  >
                    {c.email}
                  </a>
                </div>
              </div>
              <span className="rounded-full bg-[var(--color-surface)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted">
                {c.status}
              </span>
            </div>
            {c.website ? (
              <a
                href={c.website}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-xs text-muted underline"
              >
                Website
              </a>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
