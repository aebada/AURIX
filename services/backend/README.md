# AURIX Backend (Orchestration Layer)

Not yet scaffolded. Planned stack: Node.js, PostgreSQL, Redis.

AURIX does not custody funds, metals, crypto, or securities. This service
layer orchestrates licensed third-party providers (vaults, payment
processors, brokers, KYC providers) and exposes a unified API to the
mobile app, web platform, and admin portal.

Planned services (per `docs/PRODUCT_PLAN.md` section 3 and section 6 of the
earlier architecture notes):

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
