import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { MarketsTable } from "@/components/MarketsTable";

export const metadata: Metadata = {
  title: "Markets",
  description:
    "Live prices across gold, silver, and other precious metals, major cryptocurrencies, and leading stocks and indices — all in one place.",
};

export default function MarketsPage() {
  return (
    <>
      <PageHero
        eyebrow="Markets"
        title="Every asset AURIX connects to, in one place."
        description="Precious metals, crypto, and equities — the same market data that powers the AURIX wallet and dashboard."
      />
      <section className="bg-[var(--color-paper)] py-20">
        <Container>
          <MarketsTable />
          <p className="mt-10 text-xs text-muted">
            Illustrative pricing — simulated client-side for demonstration, not
            a real-time market data feed.
          </p>
        </Container>
      </section>
    </>
  );
}
