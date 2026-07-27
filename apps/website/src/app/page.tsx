import Link from "next/link";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { Card, StatCard, CheckItem } from "@/components/Card";
import { CtaBand } from "@/components/CtaBand";
import { PhoneMockup } from "@/components/PhoneMockup";
import { AppStoreBadges } from "@/components/AppStoreBadges";
import { Reveal } from "@/components/Reveal";

const problems = [
  {
    number: "01",
    title: "Fiat Inflation",
    body: "Traditional currencies are losing purchasing power at an accelerating rate. Savings are accessible, but no longer protected from systemic devaluation.",
  },
  {
    number: "02",
    title: "Crypto Volatility",
    body: "Digital assets offer speed but lack the stability required for real-world commercial use. Speculation has replaced utility in the digital frontier.",
  },
  {
    number: "03",
    title: "The Ownership Gap",
    body: "Modern platforms provide digital access but often lack true underlying asset ownership. Users hold promises, not physical reality.",
  },
];

const solutions = [
  {
    title: "Hybrid Reserve System",
    body: "Every unit is 100% backed by physical gold and silver stored in high-security, audited vaults. We bridge the gap between physical reality and digital speed.",
  },
  {
    title: "Continuous AI Audit",
    body: "Real-time cryptographic verification and AI-driven monitoring ensure that digital units always match physical reserves. Trust is measured, not promised.",
  },
  {
    title: "Instant Global Utility",
    body: "A high-performance payment network that makes precious metals as liquid as cash — instantly usable for transfers, retail payments, and savings.",
  },
];

const platform = [
  {
    title: "Unified Multi-Wallet",
    items: [
      "Real-time view of gold, silver, fiat, and crypto assets",
      "Seamless asset switching and instant liquidity",
      "Integrated market data for informed decision making",
    ],
  },
  {
    title: "Physical Asset Trading",
    items: [
      "Buy, sell, and store real gold instantly via mobile",
      "Direct allocation to physical bars in audited vaults",
      "Zero-friction entry into precious metal markets",
    ],
  },
  {
    title: "Global Payments",
    items: [
      "NFC, QR, and P2P payments for daily retail use",
      "Sharia-compliant gold-backed credit lines",
      '"Save Now Buy Later" innovative financial tools',
    ],
  },
];

const marketStats = [
  { value: "$2T+", label: "Global payments market, ripe for stable, asset-backed disruption" },
  { value: "$13T+", label: "Global gold market, now accessible via digital liquidity" },
  { value: "$4T+", label: "Ethical finance sector seeking Sharia-compliant products" },
  { value: "$1T+", label: "Real-World Asset (RWA) tokenization and digital ownership" },
];

const revenueStreams = [
  { title: "Transactions", body: "Fees on instant payments, global transfers, and P2P settlements." },
  { title: "Asset Spread", body: "Competitive spread on the buy/sell of physical gold and silver." },
  { title: "Vault Partners", body: "Commissions from global vaulting and custody partners." },
  { title: "Ethical Lending", body: "Sharia-compliant service fees on gold-backed credit lines." },
  { title: "Subscriptions", body: "Tiered premium features for high-volume retail and institutional users." },
  { title: "B2B Licensing", body: "API licensing for banks and fintechs to offer asset-backed services." },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--color-line)] bg-white">
        <Container className="grid gap-12 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <Reveal>
            <Eyebrow>The Fintech Revolution — 2026</Eyebrow>
            <h1 className="mt-5 font-extrabold tracking-tight text-4xl leading-[1.05] text-navy sm:text-5xl lg:text-7xl">
              Measured Trust.
              <br />
              <span className="text-gradient-gold">Real Digital Money.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
              AURIX combines gold- and silver-backed reserves, AI-driven
              auditing, and an instant global payment network — a new
              category of money for the post-fiat era.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/waitlist"
                className="rounded-full bg-navy px-7 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-xl hover:shadow-navy/20 active:translate-y-0"
              >
                Join the Waitlist
              </Link>
              <Link
                href="/how-it-works"
                className="rounded-full border border-[var(--color-line)] px-7 py-3.5 text-sm font-bold text-navy transition-all duration-200 hover:-translate-y-0.5 hover:border-navy hover:shadow-lg active:translate-y-0"
              >
                See How It Works
              </Link>
            </div>
            <div className="mt-8">
              <AppStoreBadges variant="light" />
            </div>
          </Reveal>
          <Reveal delay={150} className="flex items-center justify-center">
            <div className="relative flex w-full max-w-md items-center justify-center overflow-hidden rounded-[2.5rem] bg-navy-glow p-10 sm:p-14">
              <PhoneMockup />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Problem */}
      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-24">
        <Container>
          <Reveal>
            <Eyebrow>The Problem</Eyebrow>
            <h2 className="mt-4 max-w-2xl font-extrabold tracking-tight text-3xl text-navy sm:text-4xl">
              A broken financial system
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-10 border-t border-[var(--color-line)] pt-10 sm:grid-cols-3">
            {problems.map((p, i) => (
              <Reveal key={p.number} delay={i * 100}>
                <p className="font-extrabold tracking-tight text-2xl text-gold">{p.number}</p>
                <h3 className="mt-2 text-lg font-semibold text-navy">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {p.body}
                </p>
              </Reveal>
            ))}
          </div>
          <p className="mt-14 border-t border-[var(--color-line)] pt-8 font-extrabold tracking-tight text-xl italic text-navy/80">
            &ldquo;There is no system that combines real value, stability, and
            global usability.&rdquo;
          </p>
        </Container>
      </section>

      {/* Solution */}
      <section className="border-b border-[var(--color-line)] bg-white py-24">
        <Container>
          <Reveal>
            <Eyebrow>The Solution</Eyebrow>
            <h2 className="mt-4 max-w-2xl font-extrabold tracking-tight text-3xl text-navy sm:text-4xl">
              A new category of money
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-10 sm:grid-cols-3">
            {solutions.map((s, i) => (
              <Reveal key={s.title} delay={i * 100}>
                <Card>
                  <h3 className="font-extrabold tracking-tight text-lg text-navy">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {s.body}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
          <div className="mt-14 rounded-3xl bg-navy px-8 py-6 text-center">
            <p className="font-extrabold tracking-tight text-lg text-white">
              Real Asset Reserve + Digital Payment Network ={" "}
              <span className="text-gold-light">AURIX</span>
            </p>
          </div>
        </Container>
      </section>

      {/* Platform */}
      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-24">
        <Container>
          <Reveal>
            <Eyebrow>Revolutionizing Digital Ownership</Eyebrow>
            <h2 className="mt-4 max-w-2xl font-extrabold tracking-tight text-3xl text-navy sm:text-4xl">
              The all-in-one asset platform
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-10 lg:grid-cols-3">
            {platform.map((p, i) => (
              <Reveal key={p.title} delay={i * 100}>
                <h3 className="font-extrabold tracking-tight text-lg text-navy">
                  {p.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {p.items.map((item) => (
                    <CheckItem key={item}>{item}</CheckItem>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Two-layer architecture */}
      <section className="border-b border-white/10 bg-navy py-24 text-white">
        <Container>
          <Reveal>
            <Eyebrow tone="dark">Middleware Integration</Eyebrow>
            <h2 className="mt-4 max-w-2xl font-extrabold tracking-tight text-3xl sm:text-4xl">
              The two-layer architecture
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-14 lg:grid-cols-2">
            <Reveal>
              <p className="font-extrabold tracking-tight text-sm text-gold-light">
                01 &nbsp; Reserve Layer
              </p>
              <ul className="mt-5 space-y-4 text-sm leading-relaxed text-white/70">
                <li>Physical gold/silver stored in globally audited, secure vaults.</li>
                <li>Zero-Knowledge Proof (ZKP) verification for asset allocation.</li>
                <li>AI-driven anomaly detection for real-time reserve monitoring.</li>
                <li>Cryptographic link between physical bars and digital units.</li>
              </ul>
            </Reveal>
            <Reveal delay={100}>
              <p className="font-extrabold tracking-tight text-sm text-gold-light">
                02 &nbsp; Payment Layer
              </p>
              <ul className="mt-5 space-y-4 text-sm leading-relaxed text-white/70">
                <li>High-performance wallet-based settlement for instant clearing.</li>
                <li>Real-time reconciliation with the underlying Reserve Layer.</li>
                <li>Seamless integration with NFC, QR, and P2P payment rails.</li>
                <li>Scalable architecture designed for global retail transaction volume.</li>
              </ul>
            </Reveal>
          </div>
          <p className="mt-14 border-t border-white/10 pt-8 text-xs uppercase tracking-wider text-white/40">
            System integrity — real-time reconciliation ensures 1:1 backing at
            all times.
          </p>
        </Container>
      </section>

      {/* Market opportunity */}
      <section className="border-b border-[var(--color-line)] bg-white py-24">
        <Container>
          <Reveal>
            <Eyebrow>Market Opportunity</Eyebrow>
            <h2 className="mt-4 max-w-2xl font-extrabold tracking-tight text-3xl text-navy sm:text-4xl">
              Intersection of four giants
            </h2>
          </Reveal>
          <Reveal delay={100} className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {marketStats.map((s) => (
              <StatCard key={s.value} value={s.value} label={s.label} />
            ))}
          </Reveal>
        </Container>
      </section>

      {/* Revenue */}
      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr]">
            <Reveal>
              <Eyebrow>Scalable &amp; Asset-Light</Eyebrow>
              <h2 className="mt-4 font-extrabold tracking-tight text-3xl text-navy">
                Diversified revenue streams
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-muted">
                AURIX is an infrastructure layer — not a custodian. We do not
                store assets; we connect users to physical reserves via
                secure APIs.
              </p>
            </Reveal>
            <Reveal delay={100} className="grid gap-8 sm:grid-cols-2">
              {revenueStreams.map((r) => (
                <div key={r.title}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gold-dark">
                    {r.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/80">
                    {r.body}
                  </p>
                </div>
              ))}
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Competitive landscape */}
      <section className="border-b border-[var(--color-line)] bg-white py-24">
        <Container>
          <Reveal>
            <Eyebrow>Beyond Stablecoins</Eyebrow>
            <h2 className="mt-4 max-w-2xl font-extrabold tracking-tight text-3xl text-navy sm:text-4xl">
              Competitive landscape
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-10 lg:grid-cols-2">
            <Card>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
                The current market
              </h3>
              <ul className="mt-5 space-y-4 text-sm leading-relaxed text-ink/70">
                <li>DeFi for real assets with complex, non-liquid structures.</li>
                <li>Fractional ownership platforms for investment only.</li>
                <li>Stablecoins backed by debt or algorithmic promises.</li>
              </ul>
            </Card>
            <Card className="border-gold/30 !bg-navy text-white">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-light">
                The AURIX standard
              </h3>
              <ul className="mt-5 space-y-4 text-sm leading-relaxed text-white/80">
                <li>
                  <strong className="text-white">Physical Reality:</strong>{" "}
                  backed by real gold/silver, not just code.
                </li>
                <li>
                  <strong className="text-white">Daily Utility:</strong>{" "}
                  designed for instant retail transactions.
                </li>
                <li>
                  <strong className="text-white">AI Verification:</strong>{" "}
                  real-time audits via AI and physics.
                </li>
              </ul>
            </Card>
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
