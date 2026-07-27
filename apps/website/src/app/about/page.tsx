import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { Card } from "@/components/Card";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "About",
  description:
    "AURIX is the intelligent operating system for real-value digital finance — founded by Prof. Dr. Ahmed Ebada.",
};

const products = [
  {
    title: "Public Website",
    body: "Brand presence, education, and investor & partner communication — the front door to AURIX.",
  },
  {
    title: "User Mobile App",
    body: "The primary product. Daily transactions, wallet management, investing, savings, payments, and lending.",
  },
  {
    title: "Web Platform",
    body: "Full dashboard for analytics, institutional usage, treasury, and business operations.",
  },
  {
    title: "Admin Portal",
    body: "Internal operations: compliance, monitoring, reconciliation, and AI governance.",
  },
];

const positioning = {
  not: ["A crypto exchange", "A bank", "A stablecoin", "A digital gold app"],
  is: [
    "An AI-governed financial operating system",
    "Backed by real-world value",
    "Optimized for payments, savings, and investment",
    "Built for the post-fiat era",
  ],
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About AURIX"
        title="The intelligent operating system for real-value digital finance."
        description="AURIX combines fintech usability, AI governance, real-asset integrity, ethical financial infrastructure, and global interoperability into a single hybrid monetary architecture."
      />

      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-20">
        <Container>
          <div className="grid gap-14 lg:grid-cols-2">
            <div>
              <Eyebrow>Founder</Eyebrow>
              <h2 className="mt-4 font-extrabold tracking-tight text-2xl text-heading">
                Prof. Dr. Ahmed Ebada
              </h2>
              <p className="mt-2 text-sm font-medium text-gold-dark">
                Founder &amp; Visionary
              </p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
                AURIX was founded to close the gap between the stability of
                real, vaulted assets and the speed and convenience people
                expect from modern fintech.
              </p>
            </div>
            <div>
              <Eyebrow>One-Line Definition</Eyebrow>
              <p className="mt-4 font-extrabold tracking-tight text-2xl leading-snug text-heading">
                &ldquo;AURIX is a global fintech platform that turns real
                assets into instantly usable digital money through a hybrid,
                AI-powered financial infrastructure.&rdquo;
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-20">
        <Container>
          <Eyebrow>Positioning</Eyebrow>
          <h2 className="mt-4 font-extrabold tracking-tight text-3xl text-heading">
            What AURIX is — and isn&apos;t
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            <Card>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
                AURIX is not
              </h3>
              <ul className="mt-5 space-y-3 text-sm text-ink/70">
                {positioning.not.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
            <Card className="!bg-navy text-white">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-light">
                AURIX is
              </h3>
              <ul className="mt-5 space-y-3 text-sm text-white/80">
                {positioning.is.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
          </div>
        </Container>
      </section>

      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-20">
        <Container>
          <Eyebrow>Product Structure</Eyebrow>
          <h2 className="mt-4 font-extrabold tracking-tight text-3xl text-heading">
            Four connected products
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <div key={p.title}>
                <h3 className="text-base font-semibold text-heading">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand
        title="Building the future of finance."
        description="AURIX is the new monetary layer for the digital world — where money is measured, verified, and real."
      />
    </>
  );
}
