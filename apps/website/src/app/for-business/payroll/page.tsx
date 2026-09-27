"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { CertificationBanner } from "@/components/CertificationBanner";
import {
  isPayrollBenefitLive,
  type PayrollCountry,
} from "@/lib/feature-flags";
import { submitInquiry } from "@/lib/inquiry-api";
import { useLanguage } from "@/lib/i18n/language-context";

const TAX_DISCLAIMER =
  "AURIX provides tools to help administer this benefit. We are not your tax advisor. Confirm current thresholds and eligibility with your own Steuerberater/tax advisor before relying on this for payroll or tax filing.";

export default function PayrollForBusinessPage() {
  const { t, locale } = useLanguage();
  const p = t.pages.payroll;
  const [country, setCountry] = useState<PayrollCountry>("DE");
  const live = isPayrollBenefitLive(country);
  const [waitlistDone, setWaitlistDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function joinWaitlist(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (String(data.get("website") ?? "").trim()) {
      setWaitlistDone(true);
      return;
    }
    setBusy(true);
    await submitInquiry({
      kind: "waitlist",
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      country: country === "DE" ? "Germany" : "Austria",
      interests: ["AURIX for Payroll"],
      role: "Employer waitlist",
      message: `Payroll waitlist (${country})`,
      locale,
      website: "",
    });
    setWaitlistDone(true);
    setBusy(false);
  }

  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} description={p.description} />

      <div className="sticky top-0 z-20 border-b border-amber-500/20 bg-amber-500/10 px-4 py-2 text-center text-xs leading-relaxed text-amber-950 dark:text-amber-100">
        {TAX_DISCLAIMER}
      </div>

      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-16">
        <Container className="max-w-3xl">
          <label className="block text-sm font-medium text-heading">
            {p.countryLabel}
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value as PayrollCountry)}
              className="mt-2 w-full max-w-xs rounded-lg border border-[var(--color-line)] px-4 py-2.5 text-sm"
            >
              <option value="DE">Germany (DE)</option>
              <option value="AT">Austria (AT)</option>
            </select>
          </label>

          {!live ? (
            <div className="mt-6">
              <CertificationBanner kind="payroll" detail={`(${country})`} />
            </div>
          ) : null}

          <div className="mt-12">
            <Eyebrow>{p.pitchEyebrow}</Eyebrow>
          </div>
          <h2 className="mt-4 font-extrabold tracking-tight text-2xl text-heading">
            {p.pitchH2}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">{p.pitchBody}</p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-muted">
                {p.monthlyLabel}
              </p>
              <p className="mt-3 font-extrabold tracking-tight text-3xl text-gradient-gold">
                €50
              </p>
              <p className="mt-2 text-sm text-muted">{p.monthlyBody}</p>
            </div>
            <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-muted">
                {p.annualLabel}
              </p>
              <p className="mt-3 font-extrabold tracking-tight text-3xl text-gradient-gold">
                €10,000
              </p>
              <p className="mt-2 text-sm text-muted">{p.annualBody}</p>
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6">
            <h3 className="font-extrabold tracking-tight text-lg text-heading">
              {p.exampleTitle}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{p.exampleBody}</p>
          </div>

          <div className="mt-10">
            <h3 className="font-extrabold tracking-tight text-lg text-heading">
              {p.faqTitle}
            </h3>
            <ul className="mt-4 space-y-4">
              {p.faq.map((item) => (
                <li key={item.q}>
                  <p className="text-sm font-semibold text-heading">{item.q}</p>
                  <p className="mt-1 text-sm text-muted">{item.a}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 border-t border-[var(--color-line)] pt-10">
            {live ? (
              <div className="rounded-3xl border border-gold/30 bg-[var(--color-paper)] p-8 text-center">
                <p className="font-extrabold text-heading">{p.liveTitle}</p>
                <p className="mt-2 text-sm text-muted">{p.liveBody}</p>
                <Link
                  href="/contact?role=business&topic=payroll"
                  className="mt-6 inline-block rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white"
                >
                  {p.ctaLive}
                </Link>
              </div>
            ) : waitlistDone ? (
              <div className="rounded-3xl border border-gold/30 bg-[var(--color-paper)] p-8 text-center">
                <p className="font-extrabold text-heading">{p.waitThanks}</p>
                <p className="mt-2 text-sm text-muted">{p.waitThanksBody}</p>
              </div>
            ) : (
              <form
                onSubmit={joinWaitlist}
                className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-paper)] p-8"
              >
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                />
                <p className="font-extrabold tracking-tight text-lg text-heading">
                  {p.waitTitle}
                </p>
                <p className="mt-2 text-sm text-muted">{p.waitBody}</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-heading">
                    {p.name}
                    <input
                      required
                      name="name"
                      type="text"
                      className="mt-2 w-full rounded-lg border border-[var(--color-line)] px-4 py-2.5 text-sm"
                    />
                  </label>
                  <label className="block text-sm font-medium text-heading">
                    {p.email}
                    <input
                      required
                      name="email"
                      type="email"
                      className="mt-2 w-full rounded-lg border border-[var(--color-line)] px-4 py-2.5 text-sm"
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="mt-6 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {busy ? "…" : p.ctaWait}
                </button>
              </form>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
