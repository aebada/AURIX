# London gold connectors — founder playbook (do this in order)

Software in this repo covers **quotes**, **practice orders**, and **fiat reservation checkout (no vault)**.  
**You** still have to contract a London-linked custodian, license the product, and tell counsel before any live mint.

Do **not** set `RESERVE_LIVE=true` (admin Settings, backend env, or `NEXT_PUBLIC_RESERVE_LIVE`) until Step 12 is complete.

Contact for vendor forms: **contact@aurixapp.de**. Paste templates from `docs/london-vendor-rfi-templates.md`. Use each company’s **public contact / sales form** — do not invent personal emails.

---

## Step 1 — Decide the first jurisdiction (you)

Pick **one** launch country for allocated digital gold (likely **Germany** or **UK**).  
Write it down. All later contracts, KYC, and PSP settings follow this country.

You cannot skip this. Counsel, PSP, and vault onboarding all ask “where is the customer?”

## Step 2 — Confirm what you are selling (counsel, you)

Ask a financial-services lawyer in that country:

> Is AURIX BPC a claim on **allocated metal**, **e-money**, a **security**, or something else?

Do not market “1:1 vaulted gold” until they answer in writing.

## Step 3 — Keep the product honest while you wait (already built)

Check live:

- https://aurixapp.de/app/trade/ — practice buy/sell + indicative London-linked quote  
- Admin **Metal orders** — practice queue (`quoted` / `paid` / `allocated`)  
- Admin **Reserves** — mock report, `liveVault: false`

If copy ever says metal is vaulted or redeemable, revert it.

## Step 4 — Price rail (ops, 30 minutes)

**Already live on the website** via `gold-api.com` + FX (indicative only).

Optional hardening (Node mock API):

1. In `services/backend/.env` set `PRICE_PROVIDER=live`  
2. Restart the backend  
3. `GET /market-data/prices?currency=EUR` should return `kind: indicative_spot`, `liveCustody: false`

Paid upgrades later (after RFI replies): Metals-API or MetalpriceAPI keys in `auth-lib/.env` / backend `.env` as `METALS_API_KEY` / `METALPRICE_API_KEY` — adapters are reserved; do not treat them as custody.

## Step 5 — Fiat PSP keys on the **server only** (you, Hostinger)

Payments are **not** gold. They only collect EUR for a **reservation**.

On the live server, edit **`auth-lib/.env` only** (never git):

```
STRIPE_SECRET_KEY=sk_live_or_sk_test_…
PAYPAL_CLIENT_ID=…
PAYPAL_CLIENT_SECRET=…
PAYPAL_MODE=sandbox
```

Start with **sandbox / test** keys. Switch `PAYPAL_MODE=live` and live Stripe keys only after a test payment works.

Then open:

- https://aurixapp.de/auth/checkout-config.php  

Expect `{ "stripe": true or false, "paypal": true or false, "liveCustody": false }`.

Stripe Dashboard: add success/cancel URLs for `https://aurixapp.de/app/checkout/return/` and `https://aurixapp.de/app/trade/`.

## Step 6 — Test a fiat reservation (you)

1. Open https://aurixapp.de/app/trade/  
2. If keys are configured, use **Pay with Stripe** or **Pay with PayPal** (buy side)  
3. Pay a small test amount  
4. Confirm email to `MAIL_NOTIFY_TO`  
5. Status must stay **paid / allocation pending certification** — no BPC mint, no vault bar list

Practice **Confirm buy** still only moves local practice balances.

## Step 7 — Send vendor RFIs this week (you)

Open each public site and paste the matching template from `docs/london-vendor-rfi-templates.md`.

**Do first (fastest path to an order API):**

1. [BullionVault](https://www.bullionvault.com) — corporate / institutional enquiry  
2. [Goldmoney](https://www.goldmoney.com) — business / partnership  

**In parallel (vault reporting, often EDI, not a retail mint API):**

3. [Brink’s](https://www.brinks.com) — vaulting / logistics  
4. [Loomis](https://www.loomis.com) and [Malca-Amit](https://www.malca-amit.com)  

**Price (optional, already have a free prototype feed):**

5. [Metals-API](https://metals-api.com)  
6. [MetalpriceAPI](https://metalpriceapi.com)  
7. [GoldAPI](https://www.goldapi.io) — if you need a paid SLA vs gold-api.com  

Ask every metal mover for: API/EDI docs, sandbox, min volumes, **insurance wording**, **bar-list / allocation export**, London vault location, LBMA Responsible Sourcing, commercial terms.

Log replies in Admin **Investors** (tag interest **custodian/vault partnership**) or a simple spreadsheet.

## Step 8 — Pick one allocated partner (you + counsel)

Choose **one** of: BullionVault-style platform **or** a signed London vault with an allocation feed.

Do not integrate two live custodians at once.

When they send a sandbox, we wire a real `CustodyProvider` adapter. Until then the code uses **mock only**.

## Step 9 — KYC / AML vendor (you)

Buy a live KYC + sanctions vendor (the admin **KYC queue** is not a licensed check).  
Screen every buyer and redeem request before any live allocate.

## Step 10 — Sign the custody contract (you + counsel)

Must include: insurance, allocation rules, bar lists or equivalent, redemption/delivery, London (or named) vault, audit access.

No signed PDF → no live adapter.

## Step 11 — Independent attestation path (you)

Schedule a Big Four / LBMA-approved assayer or equivalent **before** marketing 1:1.  
Phase C (`ReserveLedgerEntry`, ZKP) is schema-only until this exists.

## Step 12 — Flip live (last; engineer + you)

Only after Steps 2, 9, 10, 11:

1. Wire the signed partner into `services/backend/src/providers/custody/`  
2. Ingest real mass/purity/timestamp into `ReserveLedgerEntry`  
3. Counsel signs off UI copy  
4. Then — and only then — `RESERVE_LIVE=true` in **one** jurisdiction  
5. Enable `POST /orders/:id/mint` for that pilot  

Until then: `/app/trade` practice + optional fiat reservation remain the only user paths.

---

## What you do this week (checklist)

| # | You | Done when |
|---|-----|-----------|
| 1 | Choose launch country | One sentence in email to counsel |
| 2 | Book counsel for BPC characterization | Meeting scheduled |
| 3 | Put **test** Stripe + PayPal keys in live `auth-lib/.env` | `checkout-config.php` shows true |
| 4 | One sandbox payment | Paid reservation email received |
| 5 | Send BullionVault + Goldmoney RFIs | Form confirmation |
| 6 | Send Brink’s / Loomis / Malca-Amit RFIs | Form confirmation |
| 7 | Do **not** toggle RESERVE_LIVE | Still false everywhere |

---

## What engineering already did (do not redo)

- Phase A quotes (backend, PHP, `/app/trade`)  
- `CustodyProvider` mock; live redeem refused  
- Practice `POST /orders` → pay → allocate; mint 403  
- Admin metal orders + reserves  
- Fiat checkout classes + HTTP endpoints (need your keys)  
- Prisma `MetalOrder`, `ReserveLedgerEntry`, `Custodian` (not live DB)

## Still blocked on you / third parties

Signed vault or allocated platform, legal characterization, live KYC vendor, licensed PSP in production mode, independent audit, `RESERVE_LIVE`.
