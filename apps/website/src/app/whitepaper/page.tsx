"use client";

import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { CtaBand } from "@/components/CtaBand";
import { useLanguage } from "@/lib/i18n/language-context";

export default function WhitepaperPage() {
  const { t } = useLanguage();
  const p = t.pages.whitepaper;

  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} description={p.description} />

      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-20">
        <Container>
          <div className="space-y-8">
            {p.sections.map((s) => (
              <Card key={s.title}>
                <h2 className="font-extrabold tracking-tight text-xl text-heading">{s.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">{s.body}</p>
                {"href" in s && s.href ? (
                  <Link
                    href={s.href}
                    className="mt-4 inline-block text-sm font-semibold text-gold-dark hover:underline"
                  >
                    {p.readMore}
                  </Link>
                ) : null}
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
