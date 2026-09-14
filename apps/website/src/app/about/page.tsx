"use client";

import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { Card } from "@/components/Card";
import { CtaBand } from "@/components/CtaBand";
import { useLanguage } from "@/lib/i18n/language-context";

export default function AboutPage() {
  const { t } = useLanguage();
  const p = t.pages.about;

  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} description={p.description} />

      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-20">
        <Container>
          <div className="grid gap-14 lg:grid-cols-2">
            <div>
              <Eyebrow>{p.founderEyebrow}</Eyebrow>
              <h2 className="mt-4 font-extrabold tracking-tight text-2xl text-heading">
                Prof. Dr. Ahmed Ebada
              </h2>
              <p className="mt-2 text-sm font-medium text-gold-dark">{p.founderRole}</p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">{p.founderBody}</p>
            </div>
            <div>
              <Eyebrow>{p.defEyebrow}</Eyebrow>
              <p className="mt-4 font-extrabold tracking-tight text-2xl leading-snug text-heading">
                {p.definition}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-20">
        <Container>
          <Eyebrow>{p.posEyebrow}</Eyebrow>
          <h2 className="mt-4 font-extrabold tracking-tight text-3xl text-heading">{p.posH2}</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            <Card>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">{p.isNot}</h3>
              <ul className="mt-5 space-y-3 text-sm text-ink/70">
                {p.notItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
            <Card className="!bg-navy text-white">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-light">{p.is}</h3>
              <ul className="mt-5 space-y-3 text-sm text-white/80">
                {p.isItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
          </div>
        </Container>
      </section>

      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-20">
        <Container>
          <Eyebrow>{p.prodEyebrow}</Eyebrow>
          <h2 className="mt-4 font-extrabold tracking-tight text-3xl text-heading">{p.prodH2}</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {p.products.map((prod) => (
              <div key={prod.title}>
                <h3 className="text-base font-semibold text-heading">{prod.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{prod.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand title={p.ctaTitle} description={p.ctaDescription} />
    </>
  );
}
