import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { Card } from "@/components/Card";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "How AURIX turns vaulted gold and silver into instantly usable digital money — from minting to redemption.",
};

const steps = [
  {
    step: "1",
    title: "Vault Deposit",
    body: "Physical gold or silver is deposited into a certified vault (e.g. Brinks, Malca-Amit). Weight, purity, serial/batch ID, and insurance coverage are verified.",
  },
  {
    step: "2",
    title: "API Confirmation",
    body: "The vault sends a signed confirmation via API — deposit ID, grams, location, and timestamp — into the AURIX reconciliation layer.",
  },
  {
    step: "3",
    title: "Token Minting",
    body: "The system mints digital units at a fixed atomic ratio: 0.0001g of metal per unit. Ten grams of gold, for example, mints 100,000 units.",
  },
  {
    step: "4",
    title: "Ledger Registration",
    body: "Every minted unit is linked to a vault ID, batch reference, and audit hash inside the AURIX platform ledger.",
  },
  {
    step: "5",
    title: "Continuous Proof-of-Reserve",
    body: "Vaults send periodic reserve snapshots. The system hashes them cryptographically, and AI verifies there is never more issued than is vaulted.",
  },
  {
    step: "6",
    title: "Everyday Use",
    body: "Units move instantly for payments, transfers, savings, and loan collateral — transactions move ownership rights, not physical metal.",
  },
  {
    step: "7",
    title: "Redemption",
    body: "A user requests physical gold, the corresponding balance is locked and burned, and the vault releases the equivalent metal for delivery or pickup.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How It Works"
        title="From vaulted metal to instant digital money."
        description="AURIX does not custody assets. It is the orchestration and intelligence layer that connects licensed vault, payment, and compliance providers into one coherent, auditable system."
      />

      <section className="border-b border-[var(--color-line)] bg-white py-20">
        <Container>
          <Eyebrow>The Two-Layer Architecture</Eyebrow>
          <h2 className="mt-4 font-extrabold tracking-tight text-3xl text-navy">
            Reserve Layer + Payment Layer
          </h2>
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <Card>
              <h3 className="font-extrabold tracking-tight text-lg text-navy">
                01 Reserve Layer
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Real gold and silver, held by regulated custodians in
                audited vaults. AURIX never touches the metal directly —
                it verifies it.
              </p>
            </Card>
            <Card>
              <h3 className="font-extrabold tracking-tight text-lg text-navy">
                02 Payment Layer
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Instant wallet-based settlement, reconciled in real time
                against the Reserve Layer, running over NFC, QR, and P2P
                rails.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-20">
        <Container>
          <Eyebrow>Gold Tokenization Model</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-extrabold tracking-tight text-3xl text-navy">
            Physical-to-digital, step by step
          </h2>
          <div className="mt-14 space-y-10">
            {steps.map((s) => (
              <div
                key={s.step}
                className="grid gap-4 border-t border-[var(--color-line)] pt-8 sm:grid-cols-[80px_1fr]"
              >
                <p className="font-extrabold tracking-tight text-3xl text-gold">{s.step}</p>
                <div>
                  <h3 className="text-base font-semibold text-navy">
                    {s.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-14 rounded-3xl bg-navy px-8 py-8 text-center">
            <p className="font-mono text-sm text-white/60">
              Reserve rule
            </p>
            <p className="mt-2 font-extrabold tracking-tight text-xl text-white">
              &sum; units issued &le; &sum; grams vaulted
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b border-[var(--color-line)] bg-white py-20">
        <Container>
          <Eyebrow>Allocation Model</Eyebrow>
          <h2 className="mt-4 font-extrabold tracking-tight text-3xl text-navy">
            Pooled today, fully allocated tomorrow
          </h2>
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <Card>
              <h3 className="text-base font-semibold text-navy">
                Fully Allocated
              </h3>
              <p className="mt-2 text-xs uppercase tracking-wider text-gold-dark">
                Recommended, premium tier
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Each user owns specific, identifiable gold. Strongest trust
                model; higher operating cost.
              </p>
            </Card>
            <Card>
              <h3 className="text-base font-semibold text-navy">Pooled</h3>
              <p className="mt-2 text-xs uppercase tracking-wider text-gold-dark">
                Launch model
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Shared reserves across users. More scalable at launch, with a
                path to allocated premium accounts as AURIX grows.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
