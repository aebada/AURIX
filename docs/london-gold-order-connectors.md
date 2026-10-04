# London gold order connectors — plan (from Goldenia paper → AURIX)

**Status:** Phase A **price API is connected** (`gold-api.com`). Phase B **practice** `POST /orders` exists (mock custody). **Live online gold ordering / custody still does not exist.**  
`RESERVE_LIVE=false` remains the hard gate. Practice buy/sell fills are simulated only.

**Source:** `Goldenia_Paper_Revised.docx` (*Measured Trust: The BPC Hybrid Architecture*) + `docs/AURIX_Platform_Implementation_Requirements.md` §5.

**What you do next (ordered):** `docs/london-connectors-founder-playbook.md`  
**Paste-ready vendor emails:** `docs/london-vendor-rfi-templates.md`

---

## 1. Does the paper support London connectors?

**Yes — as target architecture, not as a shipped system.**

| Paper claim | Implication for AURIX |
|---|---|
| Spot valuation uses **LBMA** (or equivalent) feeds | London price connectivity is first-class |
| Buy flow: app → **partner vault API** → allocate → mint BPC | Need a real custody/allocation partner, not only a price API |
| Reserves in **certified, insured vaults** with mass/purity/timestamp APIs | Prefer LBMA Good Delivery / London vault reporting |
| Vault sourcing ↔ **LBMA Responsible Sourcing** | London market standards for metal provenance |
| Independent vault audit (Big Four / **LBMA-approved assayer**) | Certification path before any “physically backed” claim |
| Differentiates from PAXG-style **price-referenced** tokens | Prefer **allocated** (or clearly pooled-with-path-to-allocated) metal, not synthetic XAU exposure alone |
| Architecture is **design/prototype**; no live vault yet (paper §3, §6.4, §9) | Matches AURIX today: practice UI only |

Philosophical “art” angle in the paper (Guénon / measured trust vs pure quantity) supports **matter-backed** units — which again points to real vault allocation, not a London *price* ticker alone.

---

## 2. What “London connectors” mean in practice

Four distinct rails (do not conflate):

1. **LBMA / London price feed** — spot & fix for quoting buy/sell (`Value(BPC) = 0.0001g × P_spot`). Commercial APIs (Metals-API, MetalpriceAPI, etc.) wrapping LBMA-referenced data. **Does not move metal.**
2. **London vault / custodian APIs** — allocated (or segregated) storage reporting (mass, purity, bar list, timestamp). Candidates: Brink’s, Loomis, Malca-Amit, other LBMA-approved London vaults. Often EDI/report feeds, not a universal REST “buy gold” API.
3. **Allocated digital-gold platforms** — BullionVault, Goldmoney, Kinesis, Paxos-style issuance. Fastest path to “order online”: user pays → partner allocates → AURIX mints BPC against partner confirmation. Trade-off: less control over the paper’s ZKP/atomic telemetry layer at day one.
4. **Bullion dealers with London delivery** — retail/wholesale purchase + vault delivery instructions. Useful for inventory top-up; weaker for continuous retail mint APIs.

**Online order of digital/allocated gold** = (1) + (3 or 2) + fiat payments + KYC — not (1) alone.

---

## 3. Recommended connector stack (phased)

### Phase A — Quote only (safe now; keep `RESERVE_LIVE=false`) — **live price API connected**
- Internal `PriceProvider` interface (LBMA-referenced gold/silver).
- **Live adapter:** `gold-api.com` XAU/XAG (USD/oz) + `open.er-api.com` USD/EUR. `GET /market-data/prices` (backend) and `GET /auth/metal-quotes.php` (live static site). Client falls back to gold-api.com, then mock.
- Practice buy UI (`/app/trade`) continues to use **simulated fills**; ticket shows an **indicative London-linked quote** without claiming custody.

### Phase B — Order API (practice stub in repo; live partner still gated)
- `POST /orders`: amount_g / fiat, metal, userId → `quoted`. Then `POST /orders/:id/pay` → `paid`, `POST /orders/:id/allocate` → practice `allocated`. `minted` / `settled` refused.
- Custody adapter interface: `allocate(grams)`, `confirmAllocation(id)`, `reportReserves()`, `redeem(grams)` — **interface + mock only**; no live partner.
- First adapter: **one** allocated platform (BullionVault / Goldmoney / similar) *or* a signed vault custodian with API/EDI.
- Fiat on-ramp: licensed PSP (e.g. Stripe) — separate from metal.

### Phase C — Measured-trust layer (paper §3 / §6.4)
- Ingest vault mass/purity/timestamp into `ReserveLedgerEntry`.
- Independent attestation + ZKP proof-of-reserve before marketing “1:1 vaulted”.
- Only then consider `RESERVE_LIVE=true` in a single jurisdiction pilot.

---

## 4. Legal / commercial must-haves before turning on

Do **not** flip `RESERVE_LIVE` until counsel confirms for the launch jurisdiction(s):

- [ ] Signed **custodian / allocated-platform** agreement (insurance, bar lists, allocation rules)
- [ ] Clear legal characterization of BPC (e.g. claim on allocated metal vs e-money vs security) — jurisdiction-specific
- [ ] **KYC/AML** vendor live; sanctions screening on buy/redeem
- [ ] Fiat payments via **licensed** PSP; AURIX licensing posture reviewed (EMI / crypto-asset / commodity dealer — depends on structure)
- [ ] Risk disclosure, Terms, and redemption/delivery rules published
- [ ] Independent vault attestation path scheduled (paper §6.4)
- [ ] No UI copy claiming vaulted/redeemable metal until the above are true

---

## 5. Suggested next build steps in AURIX (no full implementation yet)

1. **Spec + stubs:** `PriceProvider` + `CustodyProvider` in `services/backend` (mock implementations return practice data while `RESERVE_LIVE=false`). Website practice layer: `apps/website/src/lib/app/price-provider.ts`.
2. **Vendor shortlist:** see §7 — RFI for API docs, min volumes, insurance, bar-list export.
3. **Order state machine** in Prisma (`MetalOrder`) / mock-db, admin list at `/metal-orders`.
4. **Keep practice app** (`/app/trade`) as the only user-facing buy path until Phase C gates open. No public mint.
5. Align partner outreach: investor form already includes **custodian/vault partnership**.

---

## 6. One-line founder answer

**Yes — the paper’s architecture expects London/LBMA pricing plus partner vault allocation so users can order allocated gold online; AURIX should build those connectors, but only price + practice order UX now; real online orders wait on a signed London-linked custodian (or allocated platform), KYC/payments licensing, and `RESERVE_LIVE` certification.**

---

## 7. Vendor shortlist (RFI)

Public company / product pages only — **no invented personal emails**. Ask each for: API/EDI docs, sandbox, min volumes, insurance wording, bar-list / allocation export, London vault location, Responsible Sourcing posture, commercial terms.

### Price APIs (LBMA-referenced wrappers — do not move metal)

| Vendor | Why shortlist | RFI entry |
|---|---|---|
| [Metals-API](https://metals-api.com) | Spot/fix style metals REST; already named in this plan | Developer docs + enterprise quote via site contact |
| [MetalpriceAPI](https://metalpriceapi.com) | LBMA-referenced precious-metals feed | Docs + sales contact on site |
| [GoldAPI](https://www.goldapi.io) | Simple XAU/XAG REST for quoting prototypes | Docs + contact on site |

Official **[LBMA prices & data](https://www.lbma.org.uk/prices-and-data)** is the reference standard (AM/PM fix publications), not a retail “buy gold” REST API.

### Allocated digital-gold platforms (fastest path to order API — Phase B)

| Vendor | Why shortlist | RFI entry |
|---|---|---|
| [BullionVault](https://www.bullionvault.com) | Allocated gold/silver; London vaulting; institutional / API history | Corporate / institutional enquiry on site |
| [Goldmoney](https://www.goldmoney.com) | Allocated metal accounts; vault network incl. London | Business / partnership contact on site |

### London vault operators (reporting / EDI — often not a retail mint API)

| Vendor | Why shortlist | RFI entry |
|---|---|---|
| [Brink’s](https://www.brinks.com) | LBMA-linked vaulting & logistics in London | Global services / vaulting enquiry on site |
| [Loomis](https://www.loomis.com) / [Malca-Amit](https://www.malca-amit.com) | Precious-metals vaulting & secure logistics (London market) | Vaulting / logistics enquiry on each site |

---

## 8. Stub inventory (this repo)

| Piece | Location | Behaviour |
|---|---|---|
| `PriceProvider` | `services/backend/src/providers/price/` | Default **mock** (`practice_indicative`). Optional `PRICE_PROVIDER=live` → `indicative_spot` via gold-api.com. Always `liveCustody: false`. |
| `CustodyProvider` | `services/backend/src/providers/custody/` | `allocate` / `confirmAllocation` / `reportReserves` practice-only; `redeem` refused as live |
| Quotes HTTP | `GET /market-data/prices` | Same provider; falls back to mock on live fetch failure |
| Order machine | Prisma `MetalOrder` + `db.metalOrders` | Seeded `quoted` / `paid` / `allocated` / `cancelled`. `minted`/`settled` throw if attempted |
| Practice order API | `POST /orders` (`quoted` → `paid` → `allocated`) | Auth user; mock custody only. `POST /orders/:id/mint` → 403 |
| Admin list | `apps/admin` → Metal orders | `GET /admin/metal-orders` (auth, support+) |
| User buy | `/app/trade` only | Local practice store; indicative quote label |
| Phase C ledger | Prisma `ReserveLedgerEntry` | Schema stub; not written by runtime |

Phase B `POST /orders` is a **practice stub** (`quoted → paid → allocated`). `POST /orders/:id/mint` always 403. No public mint UI.

**Still gated:** live vault, live redeem, BPC mint, `RESERVE_LIVE`, live allocated-platform adapter, Phase C attestation / ZKP.
