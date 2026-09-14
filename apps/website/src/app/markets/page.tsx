"use client";

import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { MarketsTable } from "@/components/MarketsTable";
import { useLanguage } from "@/lib/i18n/language-context";

export default function MarketsPage() {
  const { t } = useLanguage();
  const p = t.pages.markets;

  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} description={p.description} />
      <section className="bg-[var(--color-paper)] py-20">
        <Container>
          <MarketsTable />
          <p className="mt-10 text-xs text-muted">{p.note}</p>
        </Container>
      </section>
    </>
  );
}
