"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";
import { CertificationBanner } from "@/components/CertificationBanner";
import {
  isPayrollBenefitLive,
  type PayrollCountry,
} from "@/lib/feature-flags";
import { submitInquiry } from "@/lib/inquiry-api";
import { useLanguage } from "@/lib/i18n/language-context";

const APPLY_HREF = "/for-business/payroll/apply/";

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

  const primaryCta = live ? p.ctaLive : p.ctaRegister;

  return (
    <>
      {/* Full-bleed hero — one composition, brand-first */}
      <section className="relative overflow-hidden border-b border-white/10 bg-navy-deep text-white">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 70% 10%, var(--glow-gold), transparent 55%), radial-gradient(ellipse 50% 45% at 15% 90%, var(--glow-gold-soft), transparent 50%), linear-gradient(160deg, #070a16 0%, #12162c 45%, #1a1830 100%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-gold-light) 1px, transparent 1px), linear-gradient(90deg, var(--color-gold-light) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
          aria-hidden
        />
        <Container className="relative py-20 sm:py-28 lg:py-32">
          <Reveal>
            <p className="font-display text-sm font-extrabold uppercase tracking-[0.2em] text-gold-light">
              {p.brand}
            </p>
            <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              {p.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              {p.description}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href={APPLY_HREF}
                className="rounded-full bg-gradient-gold px-8 py-3.5 text-sm font-bold text-navy shadow-lg shadow-gold/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold/30 active:translate-y-0"
              >
                {primaryCta}
              </Link>
              <a
                href="#how-it-works"
                className="rounded-full border border-white/25 bg-white/5 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gold-light/50 hover:bg-white/10 active:translate-y-0"
              >
                {p.ctaSecondary}
              </a>
            </div>
          </Reveal>
        </Container>
      </section>

      <div className="sticky top-0 z-20 border-b border-amber-500/25 bg-amber-500/15 px-4 py-2.5 text-center text-xs leading-relaxed text-amber-950 backdrop-blur-md dark:text-amber-100">
        {p.taxDisclaimer}
      </div>

      {/* Employer pitch */}
      <section
        id="how-it-works"
        className="relative overflow-hidden border-b border-[var(--color-line)] bg-[var(--color-surface)] py-20 sm:py-24"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 50% 40% at 90% 20%, var(--glow-gold-soft), transparent 55%)",
          }}
          aria-hidden
        />
        <Container className="relative max-w-3xl">
          <Reveal>
            <Eyebrow>{p.pitchEyebrow}</Eyebrow>
            <h2 className="mt-4 font-display text-3xl tracking-tight text-heading sm:text-4xl">
              {p.pitchH2}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted">{p.pitchBody}</p>
          </Reveal>
        </Container>
      </section>

      {/* Plan types */}
      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-20 sm:py-24">
        <Container>
          <Reveal>
            <Eyebrow>{p.plansEyebrow}</Eyebrow>
            <h2 className="mt-4 max-w-2xl font-display text-3xl tracking-tight text-heading sm:text-4xl">
              {p.plansH2}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
              {p.plansBody}
            </p>
          </Reveal>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <Reveal delay={80}>
              <div className="border-t-2 border-gold pt-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                  {p.monthlyLabel}
                </p>
                <p className="mt-3 font-display text-5xl tracking-tight text-gradient-gold">
                  {p.monthlyAmount}
                  <span className="text-lg font-bold text-muted"> / mo</span>
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted">{p.monthlyBody}</p>
              </div>
            </Reveal>
            <Reveal delay={160}>
              <div className="border-t-2 border-gold/50 pt-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                  {p.annualLabel}
                </p>
                <p className="mt-3 font-display text-5xl tracking-tight text-gradient-gold">
                  {p.annualAmount}
                  <span className="text-lg font-bold text-muted"> / yr</span>
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted">{p.annualBody}</p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Worked example */}
      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-20 sm:py-24">
        <Container className="max-w-3xl">
          <Reveal>
            <Eyebrow>{p.exampleEyebrow}</Eyebrow>
            <h2 className="mt-4 font-display text-3xl tracking-tight text-heading sm:text-4xl">
              {p.exampleH2}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted">{p.exampleBody}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-gold-dark">
              {p.exampleNote}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Additionality */}
      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-20 sm:py-24">
        <Container className="max-w-3xl">
          <Reveal>
            <Eyebrow>{p.additionalityEyebrow}</Eyebrow>
            <h2 className="mt-4 font-display text-3xl tracking-tight text-heading sm:text-4xl">
              {p.additionalityH2}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted">
              {p.additionalityBody}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Status + apply / waitlist */}
      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-20 sm:py-24">
        <Container className="max-w-3xl">
          <Reveal>
            <label className="block text-sm font-medium text-heading">
              {p.countryLabel}
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value as PayrollCountry)}
                className="mt-2 w-full max-w-xs rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-4 py-2.5 text-sm"
              >
                <option value="DE">{p.apply.countryDE}</option>
                <option value="AT">{p.apply.countryAT}</option>
              </select>
            </label>

            {!live ? (
              <div className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 sm:p-8">
                <CertificationBanner kind="payroll" detail={`(${country})`} />
                <h3 className="mt-6 font-display text-xl tracking-tight text-heading">
                  {p.comingSoonTitle}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {p.comingSoonBody}
                </p>
                <Link
                  href={APPLY_HREF}
                  className="mt-6 inline-flex rounded-full bg-navy px-7 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg active:translate-y-0"
                >
                  {p.comingSoonCta}
                </Link>
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-gold/30 bg-[var(--color-paper)] p-6 text-center sm:p-8">
                <p className="font-display text-xl tracking-tight text-heading">
                  {p.liveTitle}
                </p>
                <p className="mt-2 text-sm text-muted">{p.liveBody}</p>
                <Link
                  href={APPLY_HREF}
                  className="mt-6 inline-flex rounded-full bg-navy px-7 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90"
                >
                  {p.ctaLive}
                </Link>
              </div>
            )}

            {!live ? (
              <div className="mt-10 border-t border-[var(--color-line)] pt-10">
                {waitlistDone ? (
                  <div className="text-center">
                    <p className="font-display text-lg text-heading">{p.waitThanks}</p>
                    <p className="mt-2 text-sm text-muted">{p.waitThanksBody}</p>
                  </div>
                ) : (
                  <form onSubmit={joinWaitlist} className="max-w-xl">
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="absolute left-[-9999px] h-0 w-0 opacity-0"
                    />
                    <p className="font-display text-lg tracking-tight text-heading">
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
                          className="mt-2 w-full rounded-xl border border-[var(--color-line)] px-4 py-2.5 text-sm"
                        />
                      </label>
                      <label className="block text-sm font-medium text-heading">
                        {p.email}
                        <input
                          required
                          name="email"
                          type="email"
                          className="mt-2 w-full rounded-xl border border-[var(--color-line)] px-4 py-2.5 text-sm"
                        />
                      </label>
                    </div>
                    <button
                      type="submit"
                      disabled={busy}
                      className="mt-6 rounded-full border border-[var(--color-line)] px-6 py-3 text-sm font-semibold text-heading transition hover:border-navy disabled:opacity-60"
                    >
                      {busy ? "…" : p.ctaWait}
                    </button>
                  </form>
                )}
              </div>
            ) : null}
          </Reveal>
        </Container>
      </section>

      {/* FAQ */}
      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-20 sm:py-24">
        <Container className="max-w-3xl">
          <Reveal>
            <h2 className="font-display text-3xl tracking-tight text-heading">
              {p.faqTitle}
            </h2>
            <ul className="mt-10 space-y-8">
              {p.faq.map((item) => (
                <li key={item.q} className="border-t border-[var(--color-line)] pt-6">
                  <p className="text-base font-bold text-heading">{item.q}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.a}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-navy-deep py-20 text-white">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, var(--glow-gold), transparent 60%)",
          }}
          aria-hidden
        />
        <Container className="relative max-w-2xl text-center">
          <Reveal>
            <p className="font-display text-sm font-extrabold uppercase tracking-[0.2em] text-gold-light">
              {p.brand}
            </p>
            <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">
              {live ? p.liveTitle : p.comingSoonTitle}
            </h2>
            <p className="mt-4 text-base text-white/70">
              {live ? p.liveBody : p.comingSoonBody}
            </p>
            <Link
              href={APPLY_HREF}
              className="mt-8 inline-flex rounded-full bg-gradient-gold px-8 py-3.5 text-sm font-bold text-navy transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold/30"
            >
              {p.ctaRegister}
            </Link>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
