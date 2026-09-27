"use client";

import { FormEvent, useState } from "react";
import { submitInquiry } from "@/lib/inquiry-api";
import { isMaintenanceMode } from "@/lib/feature-flags";

const TICKET_SIZES = [
  "Exploring / undecided",
  "Under €50k",
  "€50k – €250k",
  "€250k – €1M",
  "€1M+",
];

const INVESTOR_TYPES = [
  "angel",
  "VC",
  "family office",
  "institutional",
  "other",
];

const INTEREST_OPTIONS = [
  "equity round",
  "strategic partnership",
  "custodian/vault partnership",
  "advisory",
];

export function InvestorInquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interests, setInterests] = useState<string[]>([]);

  function toggleInterest(opt: string) {
    setInterests((prev) =>
      prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt],
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    if (isMaintenanceMode()) {
      setError("Maintenance mode — try again later.");
      setBusy(false);
      return;
    }

    const form = e.currentTarget;
    const data = new FormData(form);
    if (String(data.get("website") ?? "").trim()) {
      setSubmitted(true);
      setBusy(false);
      return;
    }

    const consent = data.get("consent") === "on";
    if (!consent) {
      setError("Consent is required.");
      setBusy(false);
      return;
    }

    try {
      await submitInquiry({
        kind: "investor",
        name: String(data.get("name") ?? "").trim(),
        email: String(data.get("email") ?? "").trim(),
        organization: String(data.get("organization") ?? "").trim() || undefined,
        roleTitle: String(data.get("roleTitle") ?? "").trim() || undefined,
        investorType: String(data.get("investorType") ?? "").trim() || undefined,
        ticketSize: String(data.get("ticketSize") ?? "").trim() || undefined,
        interests,
        hearAbout: String(data.get("hearAbout") ?? "").trim() || undefined,
        message: String(data.get("message") ?? "").trim(),
        role: "Investor",
        website: "",
      });
      setSubmitted(true);
      form.reset();
      setInterests([]);
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
          Thank you. Our investor relations team will follow up within a few
          business days. AURIX is early-stage — product and custody rails are in
          certification, not live money movement.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-8"
    >
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

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
          Firm / fund (optional)
          <input
            name="organization"
            type="text"
            className="mt-2 w-full rounded-lg border border-[var(--color-line)] px-4 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
          />
        </label>
        <label className="block text-sm font-medium text-heading">
          Role / title (optional)
          <input
            name="roleTitle"
            type="text"
            className="mt-2 w-full rounded-lg border border-[var(--color-line)] px-4 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
          />
        </label>
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <label className="block text-sm font-medium text-heading">
          Investor type
          <select
            name="investorType"
            defaultValue={INVESTOR_TYPES[0]}
            className="mt-2 w-full rounded-lg border border-[var(--color-line)] px-4 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
          >
            {INVESTOR_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-heading">
          Typical check size (optional)
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

      <fieldset className="mt-6">
        <legend className="text-sm font-medium text-heading">Area of interest</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((opt) => {
            const on = interests.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggleInterest(opt)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  on
                    ? "bg-[var(--color-navy)] text-white"
                    : "border border-[var(--color-line)] text-muted"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="mt-6 block text-sm font-medium text-heading">
        Message
        <textarea
          required
          name="message"
          rows={5}
          placeholder="Pitch materials, diligence call, strategic partnership…"
          className="mt-2 w-full rounded-lg border border-[var(--color-line)] px-4 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
        />
      </label>
      <label className="mt-6 block text-sm font-medium text-heading">
        How did you hear about us? (optional)
        <input
          name="hearAbout"
          type="text"
          className="mt-2 w-full rounded-lg border border-[var(--color-line)] px-4 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
        />
      </label>
      <label className="mt-6 flex items-start gap-3 text-sm text-muted">
        <input required type="checkbox" name="consent" className="mt-1" />
        <span>
          I agree to be contacted about this inquiry and have read the privacy
          notice. AURIX does not claim live custody or redeemable vaulted gold
          today.
        </span>
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
