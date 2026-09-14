"use client";

import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { Card } from "@/components/Card";
import { CtaBand } from "@/components/CtaBand";
import { useLanguage } from "@/lib/i18n/language-context";

export default function HowItWorksPage() {
  const { t } = useLanguage();
  const p = t.pages.howItWorks;

  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} description={p.description} />

      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-20">
        <Container>
          <Eyebrow>{p.archEyebrow}</Eyebrow>
          <h2 className="mt-4 font-extrabold tracking-tight text-3xl text-heading">{p.archH2}</h2>
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <Card>
              <h3 className="font-extrabold tracking-tight text-lg text-heading">{p.reserveTitle}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{p.reserveBody}</p>
            </Card>
            <Card>
              <h3 className="font-extrabold tracking-tight text-lg text-heading">{p.paymentTitle}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{p.paymentBody}</p>
            </Card>
          </div>
        </Container>
      </section>

      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-20">
        <Container>
          <Eyebrow>{p.tokenEyebrow}</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-extrabold tracking-tight text-3xl text-heading">{p.tokenH2}</h2>
          <div className="mt-14 space-y-10">
            {p.steps.map((s) => (
              <div
                key={s.step}
                className="grid gap-4 border-t border-[var(--color-line)] pt-8 sm:grid-cols-[80px_1fr]"
              >
                <p className="font-extrabold tracking-tight text-3xl text-gold">{s.step}</p>
                <div>
                  <h3 className="text-base font-semibold text-heading">{s.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-14 rounded-3xl bg-navy px-8 py-8 text-center">
            <p className="font-mono text-sm text-white/60">{p.reserveRuleLabel}</p>
            <p className="mt-2 font-extrabold tracking-tight text-xl text-white">
              &sum; units issued &le; &sum; grams vaulted
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-20">
        <Container>
          <Eyebrow>{p.allocEyebrow}</Eyebrow>
          <h2 className="mt-4 font-extrabold tracking-tight text-3xl text-heading">{p.allocH2}</h2>
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <Card>
              <h3 className="text-base font-semibold text-heading">{p.allocatedTitle}</h3>
              <p className="mt-2 text-xs uppercase tracking-wider text-gold-dark">{p.allocatedTag}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted">{p.allocatedBody}</p>
            </Card>
            <Card>
              <h3 className="text-base font-semibold text-heading">{p.pooledTitle}</h3>
              <p className="mt-2 text-xs uppercase tracking-wider text-gold-dark">{p.pooledTag}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted">{p.pooledBody}</p>
            </Card>
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
