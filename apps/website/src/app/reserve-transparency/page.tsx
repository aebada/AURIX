import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { Card } from "@/components/Card";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Gold & Reserve Transparency",
  description:
    "How AURIX verifies that every digital gold and silver unit is backed 1:1 by physical, vaulted reserves.",
};

const comparison = [
  { system: "Binance", type: "No physical backing" },
  { system: "Revolut", type: "Synthetic gold exposure" },
  { system: "eToro", type: "Financial instrument" },
  { system: "PAXG", type: "Partial allocation" },
  { system: "AURIX", type: "Atomic, measurable, fully auditable units" },
];

export default function ReserveTransparencyPage() {
  return (
    <>
      <PageHero
        eyebrow="Gold & Reserve Transparency"
        title="Every unit, backed 1:1, verified continuously."
        description="AURIX's atomic unit represents 0.0001g of vaulted gold or silver — small enough for micro-payments, and traceable back to a specific vault deposit and audit hash."
      />

      <section className="border-b border-[var(--color-line)] bg-white py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-3">
            <Card>
              <h3 className="font-extrabold tracking-tight text-lg text-navy">
                Atomic Unit System
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                The smallest unit represents 0.0001g of metal, enabling
                micro-payments, fractional ownership, and global
                accessibility.
              </p>
            </Card>
            <Card>
              <h3 className="font-extrabold tracking-tight text-lg text-navy">
                AI-Audited Tokenization
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Beyond minting: continuous validation of supply versus
                reserves, transaction anomalies, and vault discrepancies.
              </p>
            </Card>
            <Card>
              <h3 className="font-extrabold tracking-tight text-lg text-navy">
                Hybrid Ledger
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                A centralized core for performance, with hash anchoring for
                audit integrity — and optional blockchain anchoring in the
                future.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-20">
        <Container>
          <Eyebrow>Vault Partners</Eyebrow>
          <h2 className="mt-4 font-extrabold tracking-tight text-3xl text-navy">
            Regulated custody, not AURIX custody
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            AURIX never takes possession of physical metal. Reserves are held
            by regulated, independently audited vault partners, with
            candidates including Brinks, Malca-Amit, Loomis, and
            BullionVault — subject to commercial validation during vendor
            selection.
          </p>
          <div className="mt-10 overflow-x-auto rounded-3xl border border-[var(--color-line)] bg-white">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-line)] text-xs uppercase tracking-wider text-muted">
                  <th className="px-6 py-4 font-semibold">System</th>
                  <th className="px-6 py-4 font-semibold">
                    Tokenization Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr
                    key={row.system}
                    className={`border-b border-[var(--color-line)] last:border-0 ${
                      row.system === "AURIX" ? "bg-gold/10" : ""
                    }`}
                  >
                    <td
                      className={`px-6 py-4 font-medium ${
                        row.system === "AURIX" ? "text-navy" : "text-ink/80"
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
        title="Read the full tokenization model."
        description="See exactly how physical deposits become digital units, and how redemption unwinds them — step by step."
        primaryHref="/how-it-works"
        primaryLabel="How It Works"
      />
    </>
  );
}
