# AURIX — Mobile App User Experience Layer (Core Product)

The mobile app is the main product. Everything users do daily must live here.

## Core Purpose
Daily payments, wallet usage, investments, real-time interactions.

## Mobile App Features

1. **Wallet & Balances** — multi-wallet (Gold/BPC, Silver, Fiat via partners), real-time balances, portfolio view (total value).
2. **Buy / Sell Assets** — buy gold & silver via API partners, sell gold → convert to fiat, show live prices, fees, final value before confirmation.
3. **Daily Payments** — NFC (tap-to-pay), QR payments, P2P transfers, request money.
4. **Transaction History** — all transactions, filters (date, type, asset), download/export (PDF later).
5. **Save & Invest** — save in gold/silver, auto-save rules, investment tracking (gold, crypto via API, stocks via API).
6. **Live Market Data** — real-time prices (gold/silver, crypto, stocks/indices), basic charts, price-threshold alerts.
7. **Loans (Gold-backed)** — borrow against gold, show collateral locked and repayment plan, repay/close loan.
8. **Save Now Buy Later** — select product, save gradually, auto-purchase when target reached.
9. **Notifications** — payments, price alerts, security alerts.
10. **Security** — 2FA, device authentication, biometric (mobile).
11. **Profile & KYC** — upload documents, verification status, limits.
12. **AI Features (mobile-facing)** — spending insights, investment suggestions, fraud alerts, smart notifications.

> Mobile = where users interact, pay, invest, and experience AURIX.

## Website (Two Parts)

### A. Marketing Website (Public)
For investors, user onboarding, SEO, brand.

Pages: Home, How it works, Security, Pricing, About, Whitepaper, Partners, Waitlist.

### B. Web App (Desktop Dashboard)
For advanced users, businesses, admin-level usage.

1. **Full Portfolio Dashboard** — detailed analytics, asset allocation, performance charts.
2. **Advanced Trading / Investments** — larger transactions, bulk orders, multi-asset view.
3. **Business Accounts (B2B)** — company wallet, payments & invoicing, reports, multi-user access.
4. **Reports & Statements** — full transaction history, tax export, accounting integration.
5. **Admin Portal (web only)** — user management, KYC approvals, fraud monitoring, API monitoring, revenue tracking.
6. **Partner / API Dashboard** — vault connections, payment providers, market data providers.

> Website = trust + onboarding + analytics + operations.

## Key Separation Logic

- **Mobile App = Execution** — payments, wallet, daily usage.
- **Website = Control & Intelligence** — analytics, business tools, admin, growth.

## Strategic Architecture

AURIX is **not** storing assets:

- Mobile + Web = Interface Layer
- Backend = Orchestration Layer
- APIs = Asset Providers

### External APIs (core to both)
1. **Vault Providers** — gold/silver custody, allocation, redemption.
2. **Payment Providers** — Stripe, PayPal, Tap, IBAN partners.
3. **Market Data** — gold prices (LBMA), crypto exchanges, stock APIs.
4. **Broker APIs** — stocks, ETFs.

### Where Money Comes From
Buy/sell spread (gold, crypto, stocks), transaction fees, payment processing margin, loan service fees, Save Now Buy Later fees, premium accounts, B2B integrations, API usage fees.

## Final Architecture Summary

- **Mobile App** — user experience + payments + investments
- **Web Platform** — trust + analytics + business + admin
- **Backend** — AI + orchestration + compliance
- **APIs** — actual money, gold, crypto, stocks live outside

> AURIX is a financial operating system — the app is the interface, the backend is the brain, and external APIs are the asset layer.
