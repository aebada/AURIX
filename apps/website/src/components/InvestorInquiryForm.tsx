"use client";

import { FormEvent, useState } from "react";
import { submitInquiry } from "@/lib/inquiry-api";

const TICKET_SIZES = [
  "Exploring / undecided",
  "Under €50k",
  "€50k – €250k",
  "€250k – €1M",
  "€1M+",
];

export function InvestorInquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      await submitInquiry({
        kind: "investor",
        name: String(data.get("name") ?? "").trim(),
        email: String(data.get("email") ?? "").trim(),
        organization: String(data.get("organization") ?? "").trim() || undefined,
        ticketSize: String(data.get("ticketSize") ?? "").trim() || undefined,
        message: String(data.get("message") ?? "").trim(),
        role: "Investor",
      });
      setSubmitted(true);
      form.reset();
    } catch {
      setError("Could not send inquiry. Please try again or email contact@aurixapp.de.");
    } finally {
      setBusy(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-gold/30 bg-[var(--color-surface)] p-8 text-center">
        <p className="font-extrabold tracking-tight text-xl text-heading">
          Inquiry received
        </p>
        <p className="mt-2 text-sm text-muted">
          Thank you. Our investor relations team will follow up. AURIX is
          early-stage — product and custody rails are in certification, not
          live money movement.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-8"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block text-sm font-medium text-heading">
          Full name
          <input
            required
            name="name"
            type="text"
            className="mt-2 w-full rounded-lg border border-[var(--color-line)] px-4 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
          />
        </label>
        <label className="block text-sm font-medium text-heading">
          Work email
          <input
            required
            name="email"
            type="email"
            className="mt-2 w-full rounded-lg border border-[var(--color-line)] px-4 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
          />
        </label>
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <label className="block text-sm font-medium text-heading">
          Organization / fund
          <input
            name="organization"
            type="text"
            className="mt-2 w-full rounded-lg border border-[var(--color-line)] px-4 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
          />
        </label>
        <label className="block text-sm font-medium text-heading">
          Indicative ticket
          <select
            name="ticketSize"
            defaultValue={TICKET_SIZES[0]}
            className="mt-2 w-full rounded-lg border border-[var(--color-line)] px-4 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
          >
            {TICKET_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="mt-6 block text-sm font-medium text-heading">
        How can we help?
        <textarea
          required
          name="message"
          rows={5}
          placeholder="Pitch materials, diligence call, strategic partnership…"
          className="mt-2 w-full rounded-lg border border-[var(--color-line)] px-4 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
        />
      </label>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="mt-8 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {busy ? "Sending…" : "Send investor inquiry"}
      </button>
    </form>
  );
}
