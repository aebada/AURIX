# AURIX Backend (Orchestration Layer)

Express + TypeScript API. Currently an **in-memory mock** — no real
database, and no real vault/payment/KYC provider is integrated. It exists
to give the mobile app, web platform, and admin portal a realistic API
surface to build against.

AURIX does not custody funds, metals, crypto, or securities. In
production, this service layer orchestrates licensed third-party providers
(vaults, payment processors, brokers, KYC providers) and exposes a unified
API — it never becomes the source of truth for real balances.

## Running locally

```bash
npm install
cp .env.example .env
npm run dev      # http://localhost:4000
```

## What's implemented (mock)

- `POST /auth/register`, `POST /auth/login` — email/password, returns a JWT
- `GET /users/me`
- `POST /kyc/submit`, `GET /kyc/status` — auto-"approves" after a few seconds; no real provider
- `GET /wallet`, `POST /wallet/transfer`, `GET /wallet/transactions`
- `GET /market-data/prices` — jittered static prices, not a live feed
- `POST /payments/topup` (dev-only fiat top-up), `POST /payments/buy`, `POST /payments/sell`
- `GET /admin/users`, `GET /admin/transactions`, `GET /admin/kyc-queue` — **not** access-controlled yet

## What's explicitly not here yet

- A real database (PostgreSQL) and cache (Redis) — see planned stack below
- Any real vault, payment, crypto, broker, or KYC provider integration
- Role-based access control on the admin routes
- The AI/risk service (see `services/ai`)

## Planned services (per `docs/PRODUCT_PLAN.md` section 3 and 6)

- **Auth service** — authentication, sessions, 2FA/WebAuthn, device trust
- **User profile service**
- **KYC/AML orchestration service** — integrates SumSub / Onfido / Veriff / Persona
- **Wallet ledger service** — platform-state entitlement ledger, never custodies assets directly
- **Partner routing service** — vault, payment, crypto, and broker API integrations
- **Market data service** — live gold/silver/FX/crypto/stock prices
- **Payment service** — Stripe / PayPal / Adyen / Tap / Wise / Plaid / TrueLayer
- **Notification service**
- **Risk and AI monitoring service** — fraud detection, anomaly detection, AI governance/voting engine
- **Admin operations service**
- **Reporting and statements service**

Data principles: never store card PANs directly; never custody user money,
metals, or securities directly; always store partner transaction references;
reconcile all balances/statuses against provider APIs.
