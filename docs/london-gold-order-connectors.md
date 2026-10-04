# London gold order connectors — plan (from Goldenia paper → AURIX)

**Status:** Design / partner-selection only. **Live online gold ordering does not exist.**  
`RESERVE_LIVE=false` remains the hard gate. Practice buy/sell is simulated only.

**Source:** `Goldenia_Paper_Revised.docx` (*Measured Trust: The BPC Hybrid Architecture*) + `docs/AURIX_Platform_Implementation_Requirements.md` §5.

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

### Phase A — Quote only (safe now; keep `RESERVE_LIVE=false`)
- Internal `PriceProvider` interface (LBMA-referenced gold/silver).
- Adapter: one commercial metals API (swap-friendly).
- Practice buy UI continues to use simulated fills; optional “indicative LBMA-linked quote” badge once feed is live **without** claiming custody.

### Phase B — Order API (still gated until legal + signed custody)
- `POST /orders` (or mint request): amount_g / fiat, metal, userId → status machine: `quoted → paid → allocated → minted → settled`.
- Custody adapter interface: `allocate(grams)`, `confirmAllocation(id)`, `reportReserves()`, `redeem(grams)`.
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

1. **Spec + stubs:** `PriceProvider` + `CustodyProvider` interfaces in `services/backend` (mock implementations that throw / return practice data while `RESERVE_LIVE=false`).
2. **Vendor shortlist:** 2–3 price APIs; 2 allocated platforms; 1–2 London vault operators — RFI for API docs, min volumes, insurance, bar-list export.
3. **Order state machine** in Prisma / mock-db (statuses above), admin view of pending allocations.
4. **Keep practice app** as the only user-facing buy path until Phase C gates open.
5. Align partner outreach (vault / custodian interest on investor form) with this stack.

---

## 6. One-line founder answer

**Yes — the paper’s architecture expects London/LBMA pricing plus partner vault allocation so users can order allocated gold online; AURIX should build those connectors, but only price + practice order UX now; real online orders wait on a signed London-linked custodian (or allocated platform), KYC/payments licensing, and `RESERVE_LIVE` certification.**
