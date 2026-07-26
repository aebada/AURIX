# AURIX Mobile App (Primary Product)

Expo + expo-router (file-based routing) app. Currently **mock data only** —
not yet wired up to `services/backend`.

Per `docs/MOBILE_UX.md`, this is the primary daily-use product: multi-wallet
(gold/silver/fiat), buy/sell, NFC/QR/P2P payments, transaction history,
save & invest, live market data, gold-backed loans, Save Now Buy Later,
notifications, biometric security, KYC, and AI-driven insights.

## Running locally

```bash
npm install
npm run web      # or: npm run ios / npm run android (needs a simulator/device)
```

## What's implemented (mock UI, no backend calls)

Five tabs, matching the "Mobile App Features" list in `docs/MOBILE_UX.md`:

- **Wallet** (`app/(tabs)/index.tsx`) — total balance, per-asset balances, recent activity
- **Buy / Sell** (`app/(tabs)/buy-sell.tsx`) — buy/sell toggle, asset picker, live price + fee preview
- **Payments** (`app/(tabs)/payments.tsx`) — pay code, send/request/scan/tap-to-pay tiles
- **Market** (`app/(tabs)/market.tsx`) — live prices list, a savings goal progress bar
- **Profile** (`app/(tabs)/profile.tsx`) — identity, KYC status badge, security/limits/support menu

Mock data lives in `lib/mock-data.ts`, shaped to mirror
`services/backend`'s API responses so real network calls are a drop-in
replacement later.

## What's explicitly not here yet

- Any network call to `services/backend` or `services/ai`
- Real authentication / session persistence
- Biometric login, device trust, 2FA
- NFC / QR / camera integration (the payments screen is static mock UI)
- Push notifications
- KYC document upload flow

## Brand assets

App icons (`assets/images/*.png`) were generated from `assets/brand/aurix-mark.png`
at the repo root — regenerate them from that source if the mark changes.
