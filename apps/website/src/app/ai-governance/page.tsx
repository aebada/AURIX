"use client";

import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { Card } from "@/components/Card";
import { CtaBand } from "@/components/CtaBand";
import { useLanguage } from "@/lib/i18n/language-context";

export default function AiGovernancePage() {
  const { t } = useLanguage();
  const p = t.pages.aiGovernance;

  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} description={p.description} />

      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-20">
        <Container>
          <Eyebrow>{p.engineEyebrow}</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-extrabold tracking-tight text-3xl text-heading">
            {p.engineH2}
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">{p.engineBody}</p>
          <div className="mt-10 rounded-3xl border border-gold/30 bg-[var(--color-paper)] p-8">
            <p className="text-sm font-semibold text-heading">{p.hardRuleTitle}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{p.hardRuleBody}</p>
          </div>
        </Container>
      </section>

      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <Card>
              <Eyebrow>{p.usersEyebrow}</Eyebrow>
              <h3 className="mt-3 font-extrabold tracking-tight text-lg text-heading">{p.usersH3}</h3>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-ink/75">
                {p.userAi.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
            <Card className="!bg-navy text-white">
              <Eyebrow tone="dark">{p.opsEyebrow}</Eyebrow>
              <h3 className="mt-3 font-extrabold tracking-tight text-lg text-white">{p.opsH3}</h3>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-white/75">
                {p.opsAi.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
