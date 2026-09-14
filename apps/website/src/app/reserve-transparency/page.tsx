"use client";

import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { Card } from "@/components/Card";
import { CtaBand } from "@/components/CtaBand";
import { useLanguage } from "@/lib/i18n/language-context";

export default function ReserveTransparencyPage() {
  const { t } = useLanguage();
  const p = t.pages.reserve;

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
          <Eyebrow>{p.vaultEyebrow}</Eyebrow>
          <h2 className="mt-4 font-extrabold tracking-tight text-3xl text-heading">{p.vaultH2}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">{p.vaultBody}</p>
          <div className="mt-10 overflow-x-auto rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)]">
            <table className="w-full min-w-[480px] text-start text-sm">
              <thead>
                <tr className="border-b border-[var(--color-line)] text-xs uppercase tracking-wider text-muted">
                  <th className="px-6 py-4 font-semibold">{p.colSystem}</th>
                  <th className="px-6 py-4 font-semibold">{p.colType}</th>
                </tr>
              </thead>
              <tbody>
                {p.comparison.map((row) => (
                  <tr
                    key={row.system}
                    className={`border-b border-[var(--color-line)] last:border-0 ${
                      row.system === "AURIX" ? "bg-gold/10" : ""
                    }`}
                  >
                    <td
                      className={`px-6 py-4 font-medium ${
                        row.system === "AURIX" ? "text-heading" : "text-ink/80"
                      }`}
                    >
                      {row.system}
                    </td>
                    <td className="px-6 py-4 text-muted">{row.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <CtaBand
        title={p.ctaTitle}
        description={p.ctaDescription}
        primaryHref="/how-it-works"
        primaryLabel={p.ctaPrimary}
      />
    </>
  );
}
