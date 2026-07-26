# AURIX

**Measured Trust. Real Digital Money.**

AURIX is a regulated orchestration layer connecting real, vaulted gold and
silver reserves to an AI-audited, instant global payment network. AURIX
does not custody funds, metals, crypto, or securities — it integrates
licensed providers (vaults, payment processors, brokers, KYC/AML services)
behind a single, coherent product experience.

See [`docs/PRODUCT_PLAN.md`](docs/PRODUCT_PLAN.md) for the full product plan,
[`docs/MOBILE_UX.md`](docs/MOBILE_UX.md) for the mobile/web UX breakdown, and
[`docs/PITCH_DECK.md`](docs/PITCH_DECK.md) for the investor pitch content.

## Repository structure

This is a monorepo covering the four connected products described in the
product plan, plus the backend services that orchestrate them:

```
apps/
  website/   Public marketing site (Next.js, static export) — built
  mobile/    Primary user product — not yet scaffolded
  web/       Desktop dashboard for advanced users & businesses — not yet scaffolded
  admin/     Internal operations / compliance portal — not yet scaffolded
services/
  backend/   Orchestration API (Node.js) — not yet scaffolded
  ai/        Fraud detection, insights, AI governance (Python) — not yet scaffolded
docs/        Product plan, mobile UX spec, pitch deck reference, deployment guide
assets/      Brand assets (logo, mark)
```

Each unscaffolded app/service has a `README.md` describing what it will do
and its planned tech stack.

## Website

`apps/website` is a Next.js site covering the pages from the product plan:
Home, About, How It Works, Features, AI & Governance, Reserve Transparency,
Pricing, Security & Trust, Partners, Whitepaper, Careers, Contact, and
Waitlist.

```bash
cd apps/website
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to apps/website/out/
```

It's configured for **static export** (no Node runtime needed on the
server) so it can be deployed to shared hosting via FTP. See
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for how the GitHub Actions
deploy workflow is wired up.

The contact and waitlist forms are currently front-end only (no backend
exists yet to receive submissions) — see the `TODO` comments in
`apps/website/src/components/ContactForm.tsx` and `WaitlistForm.tsx`.

## AURIX does not custody assets

A recurring principle throughout every product and service in this repo:
AURIX never takes possession of user funds, metals, crypto, or securities.
It orchestrates licensed third parties and reconciles against their APIs.
See `docs/PRODUCT_PLAN.md` section 5 and `docs/MOBILE_UX.md`.
