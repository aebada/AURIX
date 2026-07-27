# AURIX Web Platform (Desktop Dashboard)

Next.js app. **Overview and Transactions are wired up to the real
`services/backend` API** (real auth, real wallet ledger). Statements,
Business, and Partners & API are still mock data — the backend has no
endpoints for those yet.

Per `docs/PRODUCT_PLAN.md` (section 3.3) and `docs/MOBILE_UX.md`, this is
the desktop dashboard for advanced users and businesses: portfolio
analytics, treasury management, corporate/business wallets, merchant
dashboard, reports & statements, and API/partner management.

## Running locally

This app needs `services/backend` running to do anything beyond show the
login screen.

```bash
# terminal 1
cd services/backend
npm install
npm run dev            # http://localhost:4000

# terminal 2
cd apps/web
cp .env.example .env.local   # NEXT_PUBLIC_API_URL, defaults to localhost:4000
npm install
npm run dev             # http://localhost:3000
```

Register a new account from `/login`, then use the "Quick actions" card on
Overview to top up fiat and buy gold against the mock ledger.

## What's implemented (live via services/backend)

- **Auth** — register/login backed by real JWTs; session persisted in
  `localStorage`, gates the whole dashboard route group (`(dashboard)`)
- **Overview** (`/`) — real wallet balances, computed USD allocation using
  live mock market prices, recent transactions, and quick actions (top up
  fiat, buy gold) that call `services/backend` directly
- **Transactions** (`/transactions`) — full transaction history from the
  wallet ledger, including partner references

## What's still mock data

- **Statements** (`/statements`) — no real statement/PDF generation; the
  backend has no endpoint for this yet
- **Business** (`/business`) — company wallets with role display; no real
  multi-user permissions
- **Partners & API** (`/partners`) — partner connection status, API key
  list; the backend has no partner/API-key management endpoints yet

## What's explicitly not here yet

- Statement/PDF generation
- Real API key issuance
- Role-based access control for business wallets
- Refresh tokens / session expiry handling beyond the JWT's own `exp`
