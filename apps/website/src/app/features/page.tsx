"use client";

import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { CheckItem } from "@/components/Card";
import { CtaBand } from "@/components/CtaBand";
import { useLanguage } from "@/lib/i18n/language-context";

export default function FeaturesPage() {
  const { t } = useLanguage();
  const p = t.pages.features;

  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} description={p.description} />

      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-20">
        <Container>
          <Eyebrow>{p.mobileEyebrow}</Eyebrow>
          <h2 className="mt-4 font-extrabold tracking-tight text-3xl text-heading">{p.mobileH2}</h2>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {p.mobileGroups.map((g) => (
              <div key={g.title}>
                <h3 className="text-base font-semibold text-heading">{g.title}</h3>
                <ul className="mt-4 space-y-3">
                  {g.items.map((item) => (
                    <CheckItem key={item}>{item}</CheckItem>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-20">
        <Container>
          <Eyebrow>{p.webEyebrow}</Eyebrow>
          <h2 className="mt-4 font-extrabold tracking-tight text-3xl text-heading">{p.webH2}</h2>
          <div className="mt-12 grid gap-10 sm:grid-cols-2">
            {p.webGroups.map((g) => (
              <div key={g.title}>
                <h3 className="text-base font-semibold text-heading">{g.title}</h3>
                <ul className="mt-4 space-y-3">
                  {g.items.map((item) => (
                    <CheckItem key={item}>{item}</CheckItem>
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
