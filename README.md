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
product plan, plus the backend services that orchestrate them. **Every
app/service below is a working scaffold built against mock data — none of
them are wired up to each other or to a real database/provider yet.** Each
has its own `README.md` detailing exactly what's implemented vs. not.

```
apps/
  website/   Public marketing site (Next.js, static export)
  mobile/    Primary user product (Expo + expo-router) — 5 tabs, mock data
  web/       Desktop dashboard (Next.js) — portfolio, transactions, business, partners/API
  admin/     Internal operations portal (Next.js) — KYC, monitoring, partner health, AI governance
services/
  backend/   Orchestration API (Express + TypeScript) — in-memory mock DB, full auth/wallet/payments flow
  ai/        Fraud scoring, insights, AI governance (FastAPI) — rule-based mocks, no trained models
docs/        Product plan, mobile UX spec, pitch deck reference, deployment guide
assets/      Brand assets (logo, mark)
```

## Status at a glance

| App/service | Runs | Talks to other services | Auth |
|---|---|---|---|
| `apps/website` | ✅ | n/a (static) | n/a |
| `apps/mobile` | ✅ | ❌ mock data only | ❌ |
| `apps/web` | ✅ | ✅ Overview/Transactions live via `services/backend`; Statements/Business/Partners still mock | ✅ real JWT login/register |
| `apps/admin` | ✅ | ❌ mock data only | ❌ (wide open — see its README) |
| `services/backend` | ✅ | ❌ no real vault/payment/KYC provider | ✅ JWT (dev-only secret) |
| `services/ai` | ✅ | n/a (called by backend, not yet wired) | ❌ (open) |

`apps/web` is now wired up to `services/backend` for auth, wallet
balances, and transactions — run both together locally (see the Web
platform section below). The remaining next step is wiring `apps/mobile`
and `apps/admin` up to `services/backend` the same way, and
`services/backend` up to `services/ai`.

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

## Mobile app

`apps/mobile` (Expo + expo-router) has five tabs — Wallet, Buy/Sell,
Payments, Market, Profile — matching `docs/MOBILE_UX.md`, backed by mock
data in `src/lib/mock-data.ts`.

```bash
cd apps/mobile
npm install
npm run web    # or npm run ios / npm run android
```

## Web platform

`apps/web` is a Next.js desktop dashboard: Overview, Transactions,
Statements, Business, Partners & API. Overview and Transactions are wired
up to `services/backend` for real auth, wallet balances, and transaction
history; Statements/Business/Partners are still mock data (no backend
endpoints exist for those yet). Requires `services/backend` running — see
`apps/web/README.md`.

```bash
cd services/backend && npm install && npm run dev   # http://localhost:4000, in one terminal

cd apps/web
npm install
cp .env.example .env.local
npm run dev    # http://localhost:3000
```

## Admin portal

`apps/admin` is a Next.js ops console: Overview, Users, KYC Queue,
Transaction Monitoring, Partner Health, AI Governance — mock data, **no
authentication or access control yet** (see its README before deploying
it anywhere reachable).

```bash
cd apps/admin
npm install
npm run dev    # http://localhost:3000
```

## Backend

`services/backend` is an Express + TypeScript API with an in-memory mock
data store: auth, KYC (auto-approve stub), wallet ledger, market data,
payments (topup/buy/sell), and admin views. No real database or provider
integration yet.

```bash
cd services/backend
npm install
cp .env.example .env
npm run dev    # http://localhost:4000
```

## AI service

`services/ai` is a FastAPI service with rule-based (non-ML) mocks for
fraud scoring, portfolio insights, and AI governance proposal evaluation.
The governance endpoint always returns `requires_human_approval: true` —
see its README for why that must never change.

```bash
cd services/ai
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

## AURIX does not custody assets

A recurring principle throughout every product and service in this repo:
AURIX never takes possession of user funds, metals, crypto, or securities.
It orchestrates licensed third parties and reconciles against their APIs.
See `docs/PRODUCT_PLAN.md` section 5 and `docs/MOBILE_UX.md`.
