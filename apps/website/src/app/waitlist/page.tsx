"use client";

import { FormEvent, useState } from "react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { useLanguage } from "@/lib/i18n/language-context";
import { submitInquiry } from "@/lib/inquiry-api";

const RATE_KEY = "aurix_waitlist_last_submit";
const RATE_MS = 60_000;

export default function WaitlistPage() {
  const { t, locale } = useLanguage();
  const p = t.pages.waitlist;
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
    setError(null);

    try {
      const last = Number(window.localStorage.getItem(RATE_KEY) || "0");
      if (Date.now() - last < RATE_MS) {
        setError(p.rateLimited);
        return;
      }
    } catch {
      /* ignore storage errors */
    }

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const country = String(data.get("country") ?? "").trim();
    const consent = data.get("consent") === "on";
    if (!name || !email || !country || !consent || interests.length === 0) return;

    setBusy(true);
    await submitInquiry({
      kind: "contact",
      name,
      email,
      role: "Waitlist",
      message: [
        "Waitlist signup",
        `Country: ${country}`,
        `Interests: ${interests.join(", ")}`,
        `Consent: yes`,
      ].join("\n"),
      locale,
    });
    try {
      window.localStorage.setItem(RATE_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setSubmitted(true);
    setBusy(false);
  }

  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} description={p.description} />
      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-16">
        <Container className="max-w-xl">
          {submitted ? (
            <div className="rounded-3xl border border-gold/30 bg-[var(--color-paper)] p-8 text-center">
              <p className="text-xl font-extrabold tracking-tight text-heading">
                {p.thanksTitle}
              </p>
              <p className="mt-2 text-sm text-muted">{p.thanksBody}</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-paper)] p-8"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block text-sm font-medium text-heading sm:col-span-2">
                  {p.name}
                  <input
                    required
                    name="name"
                    type="text"
                    autoComplete="name"
                    className="mt-2 w-full rounded-lg border border-[var(--color-line)] px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
                  />
                </label>
                <label className="block text-sm font-medium text-heading sm:col-span-2">
                  {p.email}
                  <input
                    required
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="mt-2 w-full rounded-lg border border-[var(--color-line)] px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
                  />
                </label>
                <label className="block text-sm font-medium text-heading sm:col-span-2">
                  {p.country}
                  <select
                    required
                    name="country"
                    defaultValue=""
                    className="mt-2 w-full rounded-lg border border-[var(--color-line)] px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
                  >
                    <option value="" disabled>
                      —
                    </option>
                    {p.countries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <fieldset className="mt-6">
                <legend className="text-sm font-medium text-heading">{p.interests}</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.interestOptions.map((opt) => {
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

              <label className="mt-6 flex items-start gap-3 text-sm text-muted">
                <input
                  required
                  type="checkbox"
                  name="consent"
                  className="mt-1"
                />
                <span>{p.consent}</span>
              </label>

              {error ? (
                <p className="mt-4 text-sm text-amber-800 dark:text-amber-200">{error}</p>
              ) : null}

              <button
                type="submit"
                disabled={busy || interests.length === 0}
                className="mt-8 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {busy ? "…" : p.submit}
              </button>
            </form>
          )}
        </Container>
      </section>
    </>
  );
}
