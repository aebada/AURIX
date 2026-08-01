import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { MarketsTable } from "@/components/MarketsTable";

export const metadata: Metadata = {
  title: "Markets",
  description:
    "Live prices across gold, silver, and other precious metals, major cryptocurrencies, leading stocks and indices, and global ETFs — all in one place.",
};

export default function MarketsPage() {
  return (
    <>
      <PageHero
        eyebrow="Markets"
        title="Every asset AURIX connects to, in one place."
        description="All traded precious metals, plus up to 1,000 cryptocurrencies, 1,000 stocks & indices, and 1,000 ETFs — searchable, the same market data that powers the AURIX wallet and dashboard."
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
