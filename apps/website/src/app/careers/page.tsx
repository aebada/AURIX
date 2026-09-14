"use client";

import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { Card } from "@/components/Card";
import { CtaBand } from "@/components/CtaBand";
import { useLanguage } from "@/lib/i18n/language-context";

export default function CareersPage() {
  const { t } = useLanguage();
  const p = t.pages.careers;

  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} description={p.description} />

      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-20">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {p.departments.map((d) => (
              <Card key={d.title}>
                <h3 className="font-extrabold tracking-tight text-lg text-heading">{d.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{d.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-16">
        <Container>
          <Eyebrow>{p.openEyebrow}</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-extrabold tracking-tight text-2xl text-heading">
            {p.openH2}
          </h2>
        </Container>
      </section>

      <CtaBand
        title={p.ctaTitle}
        description={p.ctaDescription}
        primaryHref="/contact"
        primaryLabel={p.ctaPrimary}
      />
    </>
  );
}
