"use client";

import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { Card, CheckItem } from "@/components/Card";
import { CtaBand } from "@/components/CtaBand";
import { useLanguage } from "@/lib/i18n/language-context";

const COMPLIANCE_PARTNERS = ["SumSub", "Onfido", "Veriff", "Persona"];

export default function SecurityPage() {
  const { t } = useLanguage();
  const p = t.pages.security;

  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} description={p.description} />

      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-3">
            {p.cards.map((c) => (
              <Card key={c.title}>
                <h3 className="font-extrabold tracking-tight text-lg text-heading">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{c.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-20">
        <Container>
          <div className="grid gap-14 lg:grid-cols-2">
            <div>
              <Eyebrow>{p.idEyebrow}</Eyebrow>
              <h2 className="mt-4 font-extrabold tracking-tight text-3xl text-heading">{p.idH2}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">{p.idBody}</p>
              <ul className="mt-6 space-y-3">
                {p.idItems.map((item) => (
                  <CheckItem key={item}>{item}</CheckItem>
                ))}
              </ul>
              <p className="mt-6 text-xs uppercase tracking-wider text-muted">
                {p.partnersLabel} {COMPLIANCE_PARTNERS.join(", ")}
              </p>
            </div>
            <div>
              <Eyebrow>{p.dataEyebrow}</Eyebrow>
              <h2 className="mt-4 font-extrabold tracking-tight text-3xl text-heading">{p.dataH2}</h2>
              <ul className="mt-6 space-y-4">
                {p.dataItems.map((item) => (
                  <CheckItem key={item}>{item}</CheckItem>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <CtaBand
        title={p.ctaTitle}
        description={p.ctaDescription}
        primaryHref="/reserve-transparency"
        primaryLabel={p.ctaPrimary}
      />
    </>
  );
}
