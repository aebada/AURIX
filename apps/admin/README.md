# AURIX Admin / Operations Portal

Next.js app. Currently **mock data, no authentication/authorization** —
every route here is wide open and must be gated before this goes anywhere
near production.

Per `docs/PRODUCT_PLAN.md` (section 3.4), this is the internal operations
console: KYC review queue, fraud/risk monitoring, vault reconciliation,
transaction monitoring, fee configuration, reserve monitoring, user
management, and AI governance voting.

## Running locally

```bash
npm install
npm run dev   # http://localhost:3000
```

## What's implemented (mock data)

- **Overview** (`/`) — user/KYC/flagged-transaction counters, reserve status, recent flags
- **Users** (`/users`) — user list with KYC status
- **KYC Queue** (`/kyc`) — pending KYC approve/reject actions (buttons are not wired up)
- **Transaction Monitoring** (`/monitoring`) — flagged transactions with a risk score
- **Partner Health** (`/partners`) — vault/payment/market-data/KYC provider status
- **AI Governance** (`/governance`) — proposal review queue; every action still requires a human decision

Mock data lives in `src/lib/mock-data.ts`.

## What's explicitly not here yet

- **Any authentication or role-based access control** — this is the most
  important gap; do not deploy this anywhere reachable until it's fixed
- Any network call to `services/backend` or `services/ai`
- Working approve/reject/generate actions (buttons are inert)
- Fee configuration and jurisdiction rule engine (mentioned in the product
  plan, not built yet)
