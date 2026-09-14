"use client";

import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { Card, CheckItem } from "@/components/Card";
import { CtaBand } from "@/components/CtaBand";
import { useLanguage } from "@/lib/i18n/language-context";

export default function PricingPage() {
  const { t } = useLanguage();
  const p = t.pages.pricing;

  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} description={p.description} />

      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-20">
        <Container>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {p.streams.map((s) => (
              <Card key={s.title}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-dark">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{s.body}</p>
              </Card>
            ))}
          </div>
          <p className="mt-8 text-xs text-muted">{p.ratesNote}</p>
        </Container>
      </section>

      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-20">
        <Container>
          <Eyebrow>{p.tiersEyebrow}</Eyebrow>
          <h2 className="mt-4 font-extrabold tracking-tight text-3xl text-heading">{p.tiersH2}</h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {p.tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-3xl p-8 ${
                  "highlighted" in tier && tier.highlighted
                    ? "border-2 border-gold bg-[var(--color-surface)] shadow-lg shadow-gold/10"
                    : "border border-[var(--color-line)] bg-[var(--color-surface)]"
                }`}
              >
                <h3 className="font-extrabold tracking-tight text-xl text-heading">{tier.name}</h3>
                <p className="mt-1 text-sm text-muted">{tier.tagline}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-gold-dark">
                  {p.pricingTba}
                </p>
                <ul className="mt-6 space-y-3">
                  {tier.features.map((f) => (
                    <CheckItem key={f}>{f}</CheckItem>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
