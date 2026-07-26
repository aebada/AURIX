# AURIX Web Platform (Desktop Dashboard)

Next.js app. Currently **mock data only** — not yet wired up to
`services/backend`.

Per `docs/PRODUCT_PLAN.md` (section 3.3) and `docs/MOBILE_UX.md`, this is
the desktop dashboard for advanced users and businesses: portfolio
analytics, treasury management, corporate/business wallets, merchant
dashboard, reports & statements, and API/partner management.

## Running locally

```bash
npm install
npm run dev   # http://localhost:3000
```

## What's implemented (mock data)

- **Overview** (`/`) — portfolio value, asset allocation bar, recent transactions
- **Transactions** (`/transactions`) — full transaction table with partner references
- **Statements** (`/statements`) — monthly statement list (no real file generation)
- **Business** (`/business`) — company wallets with role display
- **Partners & API** (`/partners`) — partner connection status, API key list

Mock data lives in `src/lib/mock-data.ts`.

## What's explicitly not here yet

- Any network call to `services/backend`
- Authentication / session handling
- Real statement/PDF generation
- Real API key issuance
- Role-based access control for business wallets
