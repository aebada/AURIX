"use client";

import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { Card, StatCard, CheckItem } from "@/components/Card";
import { CtaBand } from "@/components/CtaBand";
import { InvestorInquiryForm } from "@/components/InvestorInquiryForm";
import { useLanguage } from "@/lib/i18n/language-context";

export default function InvestorsPage() {
  const { t } = useLanguage();
  const p = t.pages.investors;
  const marketStats = t.home.market.stats;

  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} description={p.description} />

      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-20">
        <Container>
          <Eyebrow>{p.thesisEyebrow}</Eyebrow>
          <h2 className="mt-4 max-w-3xl font-extrabold tracking-tight text-3xl text-heading">{p.thesisH2}</h2>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted">{p.thesisIntro}</p>
          <div className="mt-14 grid gap-8 sm:grid-cols-2">
            {p.thesisPoints.map((point) => (
              <Card key={point.title}>
                <h3 className="font-extrabold tracking-tight text-lg text-heading">{point.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{point.body}</p>
              </Card>
            ))}
          </div>
          <p className="mt-10 max-w-3xl rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] px-5 py-4 text-sm leading-relaxed text-muted">
            Status: reserve custody, live redemption, and real fiat rails are{" "}
            <span className="font-semibold text-heading">in certification / coming soon</span>
            {" "}(RESERVE_LIVE=false). Investment conversations are about the platform thesis —
            not live vaulted product claims.
          </p>
        </Container>
      </section>

      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-20">
        <Container>
          <Eyebrow>{p.marketEyebrow}</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-extrabold tracking-tight text-3xl text-heading">{p.marketH2}</h2>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {marketStats.map((s) => (
              <StatCard key={s.value} value={s.value} label={s.label} />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-20">
        <Container>
          <div className="grid gap-14 lg:grid-cols-2">
            <div>
              <Eyebrow>{p.whyEyebrow}</Eyebrow>
              <h2 className="mt-4 font-extrabold tracking-tight text-2xl text-heading">{p.whyH2}</h2>
              <ul className="mt-8 space-y-4">
                {p.whyItems.map((item) => (
                  <CheckItem key={item}>{item}</CheckItem>
                ))}
              </ul>
            </div>
            <div>
              <Eyebrow>{p.stageEyebrow}</Eyebrow>
              <h2 className="mt-4 font-extrabold tracking-tight text-2xl text-heading">{p.stageH2}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">{p.stageBody}</p>
              <div className="mt-10 grid grid-cols-2 gap-8">
                {p.milestones.map((m) => (
                  <div key={m.label}>
                    <p className="font-extrabold tracking-tight text-3xl text-gradient-gold">{m.value}</p>
                    <p className="mt-2 text-sm font-medium text-muted">{m.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex flex-wrap gap-4 text-sm font-semibold">
                <Link href="/whitepaper" className="text-gold-dark hover:underline">
                  {p.linkWhitepaper}
                </Link>
                <Link href="/reserve-transparency" className="text-gold-dark hover:underline">
                  {p.linkReserve}
                </Link>
                <Link href="/security" className="text-gold-dark hover:underline">
                  {p.linkSecurity}
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="inquiry" className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-20">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <Eyebrow>{p.irEyebrow}</Eyebrow>
            <h2 className="mt-4 max-w-xl font-extrabold tracking-tight text-2xl text-heading sm:text-3xl">
              {p.irH2}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">{p.irBody}</p>
            <p className="mt-4 text-sm text-muted">
              Or email{" "}
              <a
                href="mailto:contact@aurixapp.de"
                className="font-semibold text-gold-dark hover:underline"
              >
                contact@aurixapp.de
              </a>
            </p>
            <ul className="mt-8 space-y-3 text-sm text-muted">
              <li>Pitch materials & architecture overview</li>
              <li>Strategic / family-office conversations</li>
              <li>Partnership diligence for banks, payments, and investments</li>
            </ul>
          </div>
          <InvestorInquiryForm />
        </Container>
      </section>

      <CtaBand
        title={p.ctaTitle}
        description={p.ctaDescription}
        primaryHref="/investors#inquiry"
        primaryLabel={p.ctaPrimary}
        secondaryHref="/whitepaper"
        secondaryLabel={p.ctaSecondary}
      />
    </>
  );
}
