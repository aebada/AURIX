# AURIX Platform — Implementation Requirements for Cursor

**Purpose of this document:** a complete, implementation-ready specification you can paste into Cursor (or hand to a dev team) to build the AURIX customer site, investor relations flow, and admin panel. It is written as a build spec, not marketing copy — every section states what to build, not why it matters.

**Product context:** AURIX is a fintech platform built around the Basic Point Coin (BPC), a digital unit backed 1:1 by audited physical gold/silver held in certified vaults, combined with a multi-asset wallet and NFC/QR/P2P payment rails. Two layers: a **BPC Reserve Layer** (vault custody, mint/redeem, ZKP + AI audit) and a **Digital Payment Layer** (wallets, instant settlement, merchant payments).

**Business model recap (five revenue lines):** (1) B2B API licensing — banks/fintechs embed BPC savings in their own apps; (2) commissions from the vault-partner/custodian network; (3) cross-border "Gold as a Service" remittance fees (Section 7); (4) Shariah-compliant lending; (5) **"AURIX for Payroll"** — recurring B2B SaaS fees from German/Austrian employers using BPC to grant employees a tax-advantaged gold benefit (Section 8, new). Line 5 carries materially lower regulatory risk than line 3 (no money-transmitter licensing) and can plausibly ship faster — worth weighing in roadmap sequencing and in investor materials as a nearer-term revenue path.

---

## 0. Ground rules for whoever implements this

- **No real custody claims until real custody exists.** Do not ship copy, UI states, or API responses that imply gold is actually vaulted, audited, or redeemable until a signed custodian agreement and audit process exist. Gate those features behind a `RESERVE_LIVE=false` flag that renders a "coming soon / in certification" state instead of live balances.
- **No single vendor covers this whole stack.** There is no one "gold API" that gives you (a) real-time price data, (b) physical vault custody, and (c) cryptographic proof-of-reserve. You need at minimum two vendor relationships (price data + custodian) plus in-house or contracted ZKP tooling. Section 5 lays out the real options found in vendor research — evaluate and contract them before writing the integration code, don't build against an assumed API contract.
- **KYC/AML and money-transmission licensing are legal prerequisites, not features.** Nothing that touches real deposits, redemptions, or fiat on/off-ramps should go live before the appropriate licensing/legal review in each target jurisdiction (this is explicitly out of scope for Cursor to "implement" — flag it back to the founder before wiring real payment rails).
- **The cross-border "buy here, redeem there" feature (Section 7) is a remittance/money-service business, not just a marketplace feature.** Letting one person pay for physical gold in Country A that a different, named person collects in Country B is functionally the same regulated activity as Western Union or MoneyGram — sender/recipient KYC, sanctions/PEP screening, and per-corridor money-transmitter or agent licensing are legal prerequisites for real money movement, exactly like the point above. Build the full UI/UX and data model now; gate actual fund/metal movement behind `CROSS_BORDER_LIVE=false` (mocked, "in certification" state) per corridor until licensing is confirmed for that specific corridor, and launch with one or two pilot corridors, never "all countries" on day one.
- **"AURIX for Payroll" (Section 8) is a benefits/incentive platform, not a money-transmission business — but it is a tax-compliance-adjacent product and must be built with that seriousness.** No money moves to a third party in another country here, so there's no money-transmitter licensing exposure like Section 7. The real risk is presenting the product in a way that reads as tax or legal advice, or that lets an employer use it to disguise a salary conversion (illegal under German/Austrian tax law). Gate real gold grants behind `PAYROLL_BENEFIT_LIVE=false` per country (Germany, Austria only at launch — no other jurisdiction has an equivalent legal basis per this project's own research), bake the "additional to salary, not a substitute" attestation into onboarding as a hard requirement, and put a persistent, visible disclaimer that AURIX provides calculation support, not tax or legal advice, and the employer's own tax advisor remains responsible for compliance.

---

## 1. Tech stack (recommended, adjust to team familiarity)

| Layer | Recommendation |
|---|---|
| Frontend | Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Next.js API routes or a separate NestJS service if the team prefers a dedicated backend |
| Database | PostgreSQL (via Prisma ORM) |
| Auth | Auth.js (NextAuth) with email/password + OAuth (Google), or Clerk/Auth0 if the team wants managed auth — either way, roles live in your own DB, not just the auth provider |
| File/object storage | S3-compatible bucket (KYC documents, vault audit PDFs) |
| Background jobs | A queue (BullMQ + Redis) for price-sync, audit-log ingestion, email sending |
| Email | Postmark or Resend for transactional email (investor form confirmations, KYC status, employer/employee benefit notifications) |
| SMS | Twilio or Vonage — required for Section 7's recipient notifications; treat as core, not optional, since the cross-border flow assumes the recipient may not have the app |
| Maps / geo | Mapbox or Google Maps Platform for the Section 7.2 store locator (pin clustering, geosearch); Google Places or Mapbox Geocoding for partner address entry/validation |
| Payroll/accounting export | DATEV export format (Section 8.1) for German SME payroll/bookkeeping handoff — evaluate DATEV's official interface docs before building a from-scratch CSV; a wrong format here is a trust-breaker with accountants |
| Hosting | Vercel (frontend) + Railway/Render/Fly.io (backend, workers, Postgres, Redis) |
| Monitoring | Sentry (errors), PostHog or Plausible (product analytics) |

---

## 2. Site map

### 2.1 Public / customer-facing
- `/` — Landing page: hero, problem/solution (fiat inflation + crypto volatility vs. measured trust), how it works (4-layer architecture, simplified), trust/compliance badges, CTA to waitlist and app download.
- `/how-it-works` — Longer explainer: minting/redemption flow, security & audit model, fee structure (once defined).
- `/pricing` — Fee schedule (spread, redemption fees) once finalized; placeholder "founding-member pricing" state until then.
- `/compliance` — Shariah advisory board, ESG/SDG alignment, regulatory status per jurisdiction (populate only with true, current statements).
- `/blog` or `/insights` — CMS-backed articles (MDX or headless CMS like Sanity).
- `/waitlist` — Customer signup form (Section 3.1).
- `/investors` — Investor relations landing page + inquiry form (Section 3.2).
- `/legal/*` — Terms, Privacy Policy, Risk Disclosure (draft with counsel before publishing).
- `/login`, `/signup`, `/dashboard/*` — Authenticated customer app shell (wallet balance, buy/sell, transaction history, KYC status) — build the UI now, gate the money-movement endpoints behind `RESERVE_LIVE`.
- `/send` — "Gold as a Service" cross-border send flow (Section 7.3): amount/metal, fulfillment choice, destination + partner picker, recipient details, review & pay, tracking. Gate the payment-capture and code-issuance endpoints behind `CROSS_BORDER_LIVE` per corridor.
- `/track/:transferId` — Public-ish tracking page (magic-link, no full login required) for both sender and recipient to follow transfer status; recipient view surfaces the "what to bring" instructions, not the raw redemption code.
- `/partners` — Public store locator (map + list, Section 7.4): search, filters (pickup/delivery/open now/metal/language), pin → detail sheet, "set as delivery point" deep-links back into `/send`.
- `/partner-with-us` — Public partner-recruitment landing page (value prop, commission teaser, requirements) + "Apply" CTA into Section 7.5's application form. Model the pitch on the JustGold benchmark already in the project docs (`JustGold_Benchmark.md`) — match or beat their zero-setup-fee, fast-onboarding framing.
- `/partner/*` — Authenticated Partner Panel (Section 7.6): separate login/role from customer accounts, same auth backend.
- `/for-business/payroll` — Public landing page pitching "AURIX for Payroll" to German/Austrian employers (Section 8.1): the tax-savings pitch, a worked example, FAQ, and a "Get started" CTA into employer signup.
- `/employer/*` — Authenticated Employer Portal (Section 8.1): separate login/role from customer, partner, and admin accounts, same auth backend.

### 2.2 Admin
- `/admin/login` — Separate login flow (can share auth backend, but force re-auth + optional 2FA for admin sessions).
- `/admin` — Dashboard: pending KYC count, open investor inquiries, total wallets, reserve-sync status (green/red), recent audit-log anomalies.
- `/admin/users` — Customer list, KYC status, wallet balances (read-only unless a support action is explicitly logged).
- `/admin/investors` — Investor inquiry pipeline (new → contacted → in diligence → closed), notes, assigned owner.
- `/admin/kyc/:userId` — Document review, approve/reject with reason, audit trail of who reviewed when.
- `/admin/reserves` — Vault balances by custodian, last audit date/report link, ZKP proof status feed.
- `/admin/transactions` — Searchable ledger of digital-layer transactions and reserve-layer mint/redeem events.
- `/admin/content` — CMS controls for landing page copy, blog posts, compliance page.
- `/admin/team` — Role management (see Section 4).
- `/admin/settings` — Feature flags (`RESERVE_LIVE`, `CROSS_BORDER_LIVE` per corridor, `PAYROLL_BENEFIT_LIVE` per country, maintenance mode), API key management (masked), webhook logs.
- `/admin/partners` — Partner directory & approval queue (Section 7.7).
- `/admin/partners/:id` — Full partner profile, locations, staff, performance, compliance flags.
- `/admin/partners/commission-rules` — Configure commission splits/tiers per country/partner type (Section 7.5).
- `/admin/transfers` — Cross-border transfer ledger, separate from regular wallet transactions (Section 7.7).
- `/admin/aml` — Sanctions-screening hits, suspicious-activity flags, case notes, SAR filing tracker (Section 7.7).
- `/admin/disputes` — Partner- or customer-raised disputes/chargebacks on cross-border transfers.
- `/admin/payroll-employers` — Employer directory & KYB approval queue (Section 8.1): pending/approved/suspended, additionality attestation on file, country, employee count, current plan.
- `/admin/payroll-employers/:id` — Full employer profile, enrolled employees, grant history, threshold-check log, billing status.
- `/admin/payroll-thresholds` — Configure the monthly (€50-style) and annual (€10,000-style) tax-free threshold values per country/tax year — never hard-code these, they change; this is the single source of truth the threshold-check logic in Section 8.1 reads from.

---

## 3. Forms

### 3.1 Customer waitlist / signup form (`/waitlist`)
Fields: full name (required), email (required, validated), country of residence (required, dropdown — drives which jurisdiction's compliance messaging is shown), phone (optional), "what are you most interested in" (multi-select: saving in gold, cross-border payments, merchant payments, institutional), referral source (optional), consent checkbox linking to Privacy Policy (required).
Behavior: on submit, create a `WaitlistEntry` row, send confirmation email, show a success state with an optional social-share prompt. Rate-limit submissions per IP to prevent spam. Add honeypot field + reCAPTCHA/Turnstile.

### 3.2 Investor inquiry form (`/investors`)
Fields: full name (required), firm/fund name (optional), email (required, business email preferred — do not hard-block personal domains, just label the field), role/title (optional), investor type (dropdown: angel, VC, family office, institutional, other), typical check size (dropdown ranges, optional), area of interest (multi-select: equity round, strategic partnership, custodian/vault partnership, advisory), message (free text), how did you hear about us (optional), consent checkbox (required).
Behavior: on submit, create an `InvestorInquiry` row with status `new`, notify the admin team via email/Slack webhook, auto-reply to the submitter with expected response time. Show inquiries in `/admin/investors` with a simple Kanban or status-dropdown pipeline.

### 3.3 KYC intake form (inside authenticated `/dashboard/kyc`)
Fields: legal name, date of birth, residential address, government ID upload (front/back), selfie/liveness check (integrate a vendor — see note below), tax ID/SSN where legally required per jurisdiction.
**Do not build ID verification/liveness in-house.** Integrate a KYC/AML vendor (e.g., Persona, Sumsub, Onfido — evaluate current pricing/coverage before picking one) rather than storing raw ID documents and doing verification yourselves; this is both a security and regulatory-liability reduction.

### 3.4 Employer signup form (`/for-business/payroll` → onboarding, Section 8.1)
Fields: company legal name, registration number (Handelsregisternummer for DE / Firmenbuchnummer for AT), country (dropdown limited to Germany/Austria — this is the `PAYROLL_BENEFIT_LIVE` gate, not a cosmetic default), company address, primary contact name/email/phone, estimated employee count, and a required **additionality attestation checkbox** with its full legal text inline (not linked off to a separate page): "I confirm this benefit will be granted in addition to employees' existing, unchanged base salary, and will not replace or reduce any part of agreed cash compensation." No submission is accepted without this box checked.
Behavior: creates an `EmployerAccount` with `kybStatus: pending`, triggers a KYB check (business registration lookup — a vendor like Sumsub or a simple registry-API check is enough at this scale, no need for a heavyweight KYB platform), and routes into `/admin/payroll-employers` for a human approval step before the employer can invite any employees. Send a confirmation email on submit and a separate "you're approved, here's how to add employees" email on approval.

---

## 4. Admin panel — roles and permissions

Implement role-based access control with these roles at minimum:

| Role | Permissions |
|---|---|
| `super_admin` | Full access to everything, including role management and feature flags. Seeded account: **`engahmed2055@gmail.com`** must be created as `super_admin` in the database seed script (see snippet below) — this is an application-level seed, not a claim on any third-party system. |
| `admin` | Full operational access (users, KYC, investors, transactions, content) but cannot change other users' roles or feature flags. |
| `compliance_officer` | KYC review/approve/reject, reserve/audit views, read-only elsewhere. |
| `support` | Read-only user/transaction views, can respond to investor inquiries, cannot touch KYC decisions or reserves. |

Seed script sketch (Prisma):
```ts
// prisma/seed.ts
await prisma.user.upsert({
  where: { email: "engahmed2055@gmail.com" },
  update: { role: "super_admin" },
  create: {
    email: "engahmed2055@gmail.com",
    name: "Ahmed",
    role: "super_admin",
    emailVerified: new Date(),
  },
});
```
Every admin route must check role server-side (middleware or route guard) — never trust a client-side role check alone. Log every admin write action (approve KYC, change role, edit content, toggle feature flag) to an `AdminAuditLog` table with actor, action, target, timestamp, and previous/new value.

---

## 5. Third-party integration: gold price + physical custody

There is no single internationally standardized "gold middleware" that does price feed, vaulting, and audit together. Build against two to three separate vendor integrations:

### 5.1 Price data (digital / market price feed)
Real-time and historical LBMA-referenced gold (and silver) spot prices are available from commercial data APIs, for example:
- **Metals-API** / **Commodities-API** — JSON REST APIs with LBMA AM/PM fix data and historical series.
- **MetalpriceAPI**, **Metals.Dev**, **UniRateAPI** — comparable commercial precious-metals price APIs with free tiers for development.
Evaluate on: LBMA-sourced accuracy, update frequency, historical depth, uptime SLA, and pricing at your expected call volume, before committing. Wrap whichever is chosen behind an internal `PriceProvider` interface so it can be swapped without touching application code.

### 5.2 Physical custody / vaulting / redemption
This is the harder integration and cannot be bought as a plug-and-play API today. Realistic paths, roughly in order of integration effort:
- **Partner with an existing tokenized-gold infrastructure provider** (e.g., Paxos-style issuance infrastructure, or an allocated-gold platform such as Kinesis Money or BullionVault/GoldMoney) and issue BPC as a layer on top of their custody, at least for an initial launch — fastest to market, but reduces AURIX's control over the audit/ZKP layer described in the paper.
- **Contract directly with a bullion custodian/vault operator** (e.g., Loomis, Brink's, Malca-Amit, or an LBMA-approved vault) for allocated storage, and build your own mint/redeem reconciliation and ZKP proof-of-reserve layer on top of their reporting feed (mass, purity, timestamp — typically delivered as periodic reports or a dedicated API/EDI feed depending on the custodian, not a universal REST standard).
- Either path requires a signed custodian agreement, insurance, and — per the accompanying paper's own recommendation — an independent third-party audit before any "physically backed" claim is shown to users.

### 5.3 Cryptographic proof-of-reserve
Build the ZKP layer in-house or with a specialized vendor; this is a cryptographic engineering task, not a subscription API. Reference implementations to study: Provisions-style proof-of-solvency protocols, zk-SNARK constructions (Zerocash-style), and Bulletproofs for range proofs. Budget for a security audit of this component specifically before launch — it is the component the paper's entire trust claim rests on.

### 5.4 Payments / fiat on-off ramp
Separately integrate a licensed payment processor (e.g., Stripe, or a crypto-friendly processor if settling in stablecoins) for fiat deposits/withdrawals. This is independent of the gold-price and custody integrations above and has its own KYC/licensing requirements.

---

## 6. Data model (core entities)

```
User { id, email, name, role, kycStatus, createdAt }
Wallet { id, userId, bpcBalance, fiatBalance, updatedAt }
Transaction { id, walletId, type[deposit|withdraw|transfer|mint|redeem], amount, counterpartyWalletId?, status, createdAt }
ReserveLedgerEntry { id, custodianId, metalType[gold|silver], grams, auditProofHash, verifiedAt }
Custodian { id, name, jurisdiction, contactInfo, lastAuditDate, lastAuditReportUrl }
WaitlistEntry { id, name, email, country, interests[], createdAt }
InvestorInquiry { id, name, firm, email, investorType, checkSize, interests[], message, status, assignedTo, createdAt }
KycDocument { id, userId, type, storageUrl, status, reviewedBy, reviewedAt }
AdminAuditLog { id, actorId, action, targetType, targetId, previousValue, newValue, createdAt }
FeatureFlag { key, value, updatedBy, updatedAt }
```

---

## 7. "Gold as a Service" — cross-border buy-anywhere, redeem-anywhere

**Concept:** a sender buys physical gold or silver (online or at a partner counter) in one country and names a recipient who collects it — as physical metal, or credited to their AURIX wallet — at a partner location in a different country, using a one-time code plus government-ID verification. Positioned to the customer like a package/money tracker (Western Union / DHL mental model), not a trading screen, because the audience for this specific flow is often less financially technical and is frequently sending value home to family — the example the founder gave is exactly this: someone in Saudi Arabia buying gold for a relative to collect in Egypt.

**Regulatory framing (read Section 0's bullet above before building this):** this is a remittance/money-service business wearing a gold-shaped UI. It needs the same legal groundwork as any cash remittance corridor — sender AND recipient KYC, sanctions/PEP screening, per-corridor money-transmitter or agent licensing, and typically local partner/agent registration requirements. Build everything below now; keep `CROSS_BORDER_LIVE` off per corridor until that corridor is actually licensed, and launch with one or two pilot corridors rather than "all partner countries" simultaneously.

### 7.1 Partner types
Jewelry/bullion retail stores, currency-exchange houses, bank branches, existing remittance agents (e.g., Western Union/MoneyGram-style agent locations that add gold as a product), and AURIX-owned flagship stores later. Each needs on-site storage/security capability and insurance — this is physical, high-value inventory sitting at a third party's premises, not a digital-only integration.

### 7.2 Store locator (`/partners`) — UX
Mobile: full-screen map with a draggable bottom sheet listing results; Desktop: map + list split view. Search by city/country/postal code. Filter chips: Pickup available, Home delivery available, Open now, Gold, Silver, Buy-back available, Language spoken. Pin clusters expand on zoom. Tapping a pin opens a detail card: photo, name, address, hours, services, rating, verified-partner badge, and a primary "Set as delivery point" CTA that deep-links into the `/send` flow with that location pre-selected. Empty state for an unsupported country: "Not available in [country] yet" + a waitlist email capture, never a dead end.

### 7.3 Sender flow (`/send`) — screen-by-screen UX
1. **Entry point:** a prominent home-screen card — "Send gold. Delivered or picked up, anywhere our partners are." Not buried inside a generic "buy" flow.
2. **Amount & metal:** gold/silver toggle, live price ticker, quick-select chips (1 g / 5 g / 10 g / custom), running total in the sender's local currency.
3. **Fulfillment choice:** two large tappable cards — "Pickup at a partner location" vs. "Home delivery" — delivery only offered where the destination country's partner network supports it; otherwise the card is visibly disabled with a one-line reason, not hidden.
4. **Destination & partner picker:** country/city selector limited to countries with active, licensed corridors; embeds the Section 7.2 map/list picker filtered to that destination.
5. **Recipient details:** full name (must match the ID they'll present — say this explicitly in the UI), phone, email, relationship (optional), expected ID type. Set expectations up front: "Your recipient will need to show a government-issued photo ID matching this name to collect."
6. **Review & pay:** itemized breakdown — metal cost, AURIX service fee, partner fulfillment fee, FX spread if cross-currency, total — plus a "who pays the fee" toggle (sender absorbs vs. split with recipient). No hidden fees revealed only at redemption.
7. **Confirmation & tracking (`/track/:transferId`):** a shipment-style status tracker — *Paid → Recipient notified → Verified → Ready for pickup / Out for delivery → Completed* — with timestamps, the partner location on a mini-map, "Resend recipient notification," and "Cancel & refund" (available only before redemption starts).
8. **Recipient notification:** SMS + email (push too, if they have the app) with sender name, amount/metal, partner address/hours/map link, and the ID requirement — sent as two parts for security: the human-readable summary immediately, and the actual redemption code released only after the recipient confirms their own phone number via an OTP link, to reduce the risk of an intercepted message being enough to collect the gold on its own.

### 7.4 Recipient redemption flow (in person)
At the partner counter, staff open the **Redeem** screen in the Partner Panel, enter or scan the recipient's code, and the transfer detail loads. Staff photograph the recipient's ID inline (reuse the same KYC/liveness vendor integration as Section 3.3, don't build ID capture twice); the app does a name-match check against the transfer's recipient name and flags a mismatch loudly rather than letting staff silently ignore it. On confirmed match, staff hand over the metal (or credit the recipient's AURIX wallet if the recipient chose digital collection), tap **Complete**, and the recipient confirms via a signature pad or an SMS confirmation link. The transaction closes, and the partner's commission for that transaction is computed and shown immediately — commission transparency at the point of service, not just on a monthly statement, is what makes partners trust and stick with the program.

### 7.5 Partner recruitment & onboarding (`/partner-with-us` → application → approval)
Public page mirrors the "Gold as a Service" pitch already benchmarked against JustGold in this project (`JustGold_Benchmark.md`): what the partner gets, the commission structure (Section 7.8), and requirements, ending in an "Apply" CTA.

Application form fields: business name, registration number, country/city, business type (retail / exchange / bank / agent), years operating, on-site security (safe/vault Y/N, insurance Y/N), estimated monthly gold-handling volume, contact person, and document uploads (business license, owner/manager ID, insurance certificate, storefront/vault photos).

Status pipeline: `submitted → under review → approved / rejected / more info needed`, with an email at every transition. Approval requires a KYB (know-your-business) check and a corridor-specific licensing check — this gates into the same `CROSS_BORDER_LIVE` flag, not a separate concept. Before activation, the partner e-signs a partner agreement covering commission terms, insurance obligations, and AML responsibilities as an agent.

### 7.6 Partner Panel (`/partner/*`) — authenticated, separate role from customer accounts
- **Home:** today's transactions, pending pickups/deliveries queue, current-period earnings, alerts (low physical stock, upcoming payout date).
- **Redeem** (Section 7.4) — the core daily-use screen; design it for speed at a counter with a customer waiting, not for browsing.
- **Inventory:** on-hand stock by metal/denomination, replenishment requests to AURIX/custodian, low-stock alerts.
- **Transactions & earnings:** full ledger, filters, per-transaction commission shown, downloadable statements (CSV/PDF).
- **Payouts:** bank details, payout schedule (weekly/monthly), history, next-payout estimate.
- **Store profile:** hours, photos, services, languages, map pin — feeds directly into the Section 7.2 public locator.
- **Team:** partner admins can add staff logins scoped to "redeem only," without payout or settings access.
- **Support/disputes:** flag a suspicious transaction, open a ticket, contest a chargeback.

### 7.7 Admin additions
`/admin/partners` (directory + approval queue), `/admin/partners/:id` (full profile, performance, compliance flags), `/admin/partners/commission-rules` (configurable splits/tiers — never hard-code a rate), `/admin/transfers` (cross-border ledger: sender, recipient, corridor, status, partner, AML flags), `/admin/aml` (sanctions-screening hits, suspicious-activity case notes, SAR filing tracker — this is a real compliance surface the compliance_officer role should own, not an afterthought), `/admin/disputes`.

### 7.8 Commission / fee model (starting recommendation — confirm with finance/legal before launch)
Benchmark context already in this project: JustGold charges roughly a 3% buy/sell spread with no other fees; global cash remittance (Western Bank/MoneyGram-style) averages 5–7% per the World Bank's Remittance Prices Worldwide data. That gap is the pitch: gold-as-remittance can plausibly undercut cash remittance fees while adding a savings/hedge benefit cash transfer doesn't have.

Suggested starting structure:
- **Customer-facing fee:** 2.5–4% of transaction value (metal cost + AURIX margin), varying by corridor risk/cost, shown fully itemized before payment.
- **Partner commission:** the greater of a flat fee per completed redemption (e.g., $3–8 equivalent, covering the partner's verification/handling cost regardless of transfer size) or a percentage of that fee (e.g., 30–40% of the customer-facing fee) — mirrors how traditional remittance agent commissions are structured, so partners already familiar with that model (existing remittance agents) recognize the deal immediately.
- **Volume tiers:** higher-volume or longer-tenured partners earn a better split and get priority placement in the store locator — gives partners a reason to grow with AURIX rather than just process transactions.
- All of the above must be configurable per country/partner/tier in `/admin/partners/commission-rules`, never hard-coded, since actual rates depend on licensing costs and competitive pressure per corridor.

### 7.9 Data model additions
```
Partner { id, businessName, country, city, type[retail|exchange|bank|agent], status[pending|approved|suspended], commissionTier, vaultCapacity, insuranceStatus, createdAt }
PartnerLocation { id, partnerId, address, lat, lng, hours, servicesOffered[], photos[], languages[] }
PartnerStaff { id, partnerId, userId, permissions[] }
CrossBorderTransfer { id, senderId, recipientName, recipientPhone, recipientIdTypeExpected, originCountry, destinationCountry, metalType, grams, feeBreakdown, status[paid|notified|verified|ready|delivered|completed|cancelled|refunded], redemptionCodeHash, partnerLocationId, createdAt, completedAt }
CommissionLedgerEntry { id, transferId, partnerId, grossFee, aurixShare, partnerShare, payoutStatus, payoutBatchId }
PartnerPayoutBatch { id, partnerId, periodStart, periodEnd, totalAmount, status, paidAt }
AmlFlag { id, transferId, flagType, screeningProvider, status[open|cleared|escalated], reviewedBy }
```

### 7.10 UX principles specific to this feature
- **Package-tracker mental model, not a trading screen** — the status tracker, notifications, and tone should feel like tracking a parcel or a Western Union transfer, because that's the closest thing the target user already understands.
- **Surface the ID requirement before payment, not at pickup** — the single biggest support-ticket risk in any agent-collection remittance model is a recipient showing up without the right ID; say it clearly at step 5 of the send flow, not just in fine print.
- **Design for the recipient's phone and network, not just the sender's** — SMS-first notifications (not push-only), works on a low-end Android/low-bandwidth connection, minimal data payload.
- **Localize this flow first** — even if the rest of the app ships English-only initially, this specific flow should support at minimum Arabic and English given the founder's own pilot example (Saudi Arabia ↔ Egypt).
- **Make partner trust visible to the sender** — verified-partner badges, ratings, and years-active on every location card; a sender choosing where a stranger will hand a relative real gold needs that reassurance at the point of choice, not buried in a profile page.

---

## 8. "AURIX for Payroll" — gold as a tax-advantaged employee benefit (Germany & Austria)

**Concept:** a B2B SaaS layer for German and Austrian employers that lets them grant employees a small, recurring gold allotment (in BPC) as a "Sachbezug"/"Sachzuwendung" — a legally distinct, tax-advantaged non-cash benefit, layered on top of AURIX's existing custody/BPC minting infrastructure rather than a second system. This is a fundamentally different regulatory animal from Section 7: no money is transmitted to a third party in another country, so there is no money-transmitter licensing exposure. It is closer in kind to how meal-voucher and gym-benefit platforms (Pluxee, givve, Edenred) already operate in Germany — just with gold instead of a voucher, and with AURIX's own mint/redeem rails behind it.

**Grounding (this project's own research, `Germany_Gold_Salary_Sachbezug_Tax.md`):** Germany (and Austria, with an equivalent regime) recognizes two tax-advantaged non-cash-benefit thresholds — roughly €50/employee/month completely tax- and social-security-free, and up to €10,000/employee/year at a flat ~30% rate paid by the employer instead of the employee's marginal income tax plus social contributions. BPC's 0.0001g base unit is well-suited to administering this precisely and digitally, which physical-coin "Goldlohn" providers today cannot do as cleanly. Treat this as a fifth, named AURIX revenue line (see the business-model recap at the top of this document) — recurring B2B platform fees, with a materially lower regulatory bar than Section 7, so it's worth weighing as a nearer-term build.

**Critical compliance guardrail — do not let this become a "salary conversion" tool.** German/Austrian tax law explicitly disallows using this kind of benefit to replace or reduce cash salary (the "Zusätzlichkeitserfordernis" — the benefit must be additional to salary already owed). The product must never present itself, in copy or UX, as a way to "pay less salary, more gold," and must never expose a control that reduces a specific employee's base pay in the same workflow that grants the benefit.

### 8.1 Full company (employer) onboarding requirements

**Entry point — `/for-business/payroll` (public landing page):**
Pitch the tax-savings math with a concrete worked example (e.g., "€50/month/employee, 0% tax and social security, vs. an equivalent net cash raise costs you X in gross salary + employer social contributions"), show the two plan types side by side (Monthly vs. Annual lump sum — Section 8.1's "Benefit plan" step), an FAQ addressing the additionality rule in plain language, a trust section (custody, security, "your tax advisor stays in the loop" framing), and one clear "Get started" CTA into signup. Gate visibility of this entire page's live signup flow — not just the backend — behind `PAYROLL_BENEFIT_LIVE` per country: for any country where the flag is off, show a "Coming soon in your country" waitlist capture instead of the signup form.

**Step 1 — Company details (Section 3.4's form):** company legal name, registration number (Handelsregisternummer for DE / Firmenbuchnummer for AT), country (dropdown hard-limited to Germany/Austria at launch), registered address, industry (optional, useful for later segmentation), estimated employee count, primary contact name/email/phone (this becomes the `EmployerAccount` admin user).

**Step 2 — Verification (KYB):** automated business-registry lookup (a lightweight vendor check or direct Handelsregister/Firmenbuch API query is sufficient at this scale — no need for a heavyweight KYB platform built for high-risk industries) plus a manual review queue in `/admin/payroll-employers` before any employee can be invited. Show the applicant a clear "Under review, typically 1–2 business days" state rather than leaving them at a dead end after submission.

**Step 3 — Additionality attestation (hard gate, cannot be skipped or pre-checked):** the full legal text inline, not linked off-page: *"I confirm this benefit will be granted in addition to employees' existing, unchanged base salary, and will not replace or reduce any part of agreed cash compensation."* Store the timestamp, IP, and signatory name against the `EmployerAccount` record — this is the single most important audit artifact if a tax authority ever questions the arrangement.

**Step 4 — Benefit plan configuration:**
- Choose plan type: **Monthly** (targets the ~€50/month tax-free threshold) or **Annual lump sum** (targets the ~€10,000/year flat-rate threshold) — these are mutually exclusive per employee, not combinable, and the UI should explain why in one line rather than just disabling the option.
- Choose grant structure: **fixed grams per period** (recommended default — German case law favors benefits structured as a fixed quantity of goods rather than a fixed euro value, since the latter reads more like disguised cash) or **fixed euro-equivalent converted to grams at time of grant** (offered, but flagged with a short "may carry more compliance risk — ask your tax advisor" note, never hidden).
- Set the default plan for new employees, with the ability to override per employee later.
- A live preview showing, for the entered employee count and grant size, the projected monthly/annual gold cost and the projected AURIX platform fee (Section 8.3) — sell the economics inline, don't make the employer do the math.

**Step 5 — Add employees:** individual add (name, email, optional employee ID for the employer's own records) or bulk CSV import with a downloadable template and inline validation (flag duplicate emails, missing required fields, before allowing submission — never fail silently on a bulk import). Each added employee triggers an invite email to claim or link an AURIX wallet; until claimed, the employer's dashboard shows the employee as `invited` and their accruing benefit is held in an escrow-style pending state, never lost.

**Step 6 — Billing setup:** company billing details, payment method (SEPA direct debit is the natural default for DACH SMEs — prioritize it over card), billing cadence (monthly, aligned to grant periods). Show the fee structure (Section 8.3) plainly before the first charge — gold cost + platform fee, itemized, never bundled into one opaque number.

**Step 7 — Go live:** once KYB is approved, the attestation is on file, at least one benefit plan is configured, and billing is set up, the employer account moves to `active` and can start granting benefits — gated by `PAYROLL_BENEFIT_LIVE` for that country actually being on. Send a "you're live" email with a short how-it-works recap and a link to the documentation-export feature (Step 8) they'll need at tax time.

**Step 8 — Ongoing employer portal (`/employer/*`), once onboarded:**
- **Dashboard:** enrolled employee count, current-period grants issued, cumulative year-to-date benefit value, next billing date, threshold-check alerts.
- **Employees:** roster with per-employee plan, status (invited/active/paused), cumulative grants — pause or remove an employee without affecting others.
- **Benefit rules:** edit the default plan, override per employee, see a change history (who changed what, when — this doubles as a compliance audit trail).
- **Threshold guardrails (system-enforced, not just a warning):** before any grant is issued, the system checks it against the admin-configured threshold (`/admin/payroll-thresholds`) for that employee's plan type and country/tax year, and blocks (not just warns on) any grant that would exceed it — with a clear inline explanation of why, and a suggestion to switch that employee to the Annual plan if they've maxed out Monthly.
- **Documentation export:** on-demand and scheduled monthly export — grams granted, market value at grant date, cumulative year-to-date, per employee — in CSV and a DATEV-compatible format, for handoff to the employer's own payroll/bookkeeping process or Steuerberater. This is the single feature most likely to determine whether an accountant recommends the product, so it deserves real design attention, not an afterthought CSV dump.
- **Billing:** invoice history, current billing method, upcoming charge preview.
- **Support:** a direct channel to AURIX support that is aware this is a compliance-adjacent product — route these tickets to someone who can speak to the tax mechanics, not generic support.

Throughout every step of onboarding and the ongoing portal, show a persistent, non-dismissable-on-first-view disclaimer: *"AURIX provides tools to help administer this benefit. We are not your tax advisor. Confirm current thresholds and eligibility with your own Steuerberater/tax advisor before relying on this for payroll or tax filing."*

### 8.2 Employee experience
Employees see their accumulated benefit inside their existing AURIX wallet (or a lightweight claim flow if they don't have one yet) as a clearly labeled "Employer gold benefit" balance, kept visually and structurally separate from any personal holdings, with a running note of tax-free value received year-to-date. Redemption to physical metal or conversion within the wallet follows the same minting/redemption architecture as the rest of the platform — no separate rail needed. An employee who leaves the company keeps whatever has already vested/been granted; the employer simply stops future grants by pausing or removing them in Step 8's roster view.

### 8.3 Fee model (starting recommendation — confirm with finance/legal before launch)
Two components, both configurable per country/tier in `/admin/payroll-thresholds`-adjacent settings, never hard-coded:
- **Platform fee:** a per-enrolled-employee-per-month SaaS fee (e.g., €1–3/employee/month), billed to the employer — the recurring-revenue core of this line, priced like comparable benefit platforms (Pluxee, givve) rather than like a financial-services spread.
- **Procurement spread:** a small markup (e.g., 1–2%) on the gold value delivered — lower than Section 7's customer-facing fee since there's no partner-network commission to fund out of it here.
No fee is ever charged to the employee — this keeps the tax-benefit math clean for them and matches how competing benefit platforms price to the employer, not the end user.

### 8.4 Data model additions
```
EmployerAccount { id, companyName, country[DE|AT], registrationNumber, contactName, contactEmail, kybStatus[pending|approved|rejected], additionalityAttestedAt, additionalityAttestedBy, additionalityAttestedIp, billingMethod, status[pending|active|suspended], createdAt }
EmployeeBenefitEnrollment { id, employerId, employeeUserId, planType[monthly|annual], gramsPerPeriod, euroEquivalentMode[boolean], status[invited|active|paused|removed], createdAt }
BenefitGrant { id, enrollmentId, grams, valueAtGrant, periodStart, periodEnd, thresholdCheckPassed, thresholdLimitUsed, createdAt }
PayrollExportBatch { id, employerId, periodStart, periodEnd, format[csv|datev], fileUrl, generatedAt }
PayrollThreshold { id, country, taxYear, planType[monthly|annual], limitValue, effectiveFrom, updatedBy }
```

### 8.5 Regulatory & rollout notes
- Gate entirely behind `PAYROLL_BENEFIT_LIVE` per country — on only for Germany and Austria at launch; this project's own research found no equivalent legal basis elsewhere, so resist requests to "just turn it on" for other markets without new legal research first.
- Materially lower regulatory bar than Section 7 (no money-transmitter licensing), but still needs a GDPR-compliant data-processing agreement for employee PII, and benefits from a co-marketing or referral relationship with a German/Austrian Steuerberater network or payroll software (DATEV, Personio, sage) to build trust and distribution at the same time.
- Recommended build sequencing: ship after the core wallet/custody layer (Section 5) is live, since real grants depend on real mint/redeem working — but this feature does **not** depend on Section 7's cross-border/partner infrastructure at all, so it can be built in parallel with, or even before, Section 7 if a DACH go-to-market is prioritized over the Saudi↔Egypt corridor.

---

## 9. Non-functional requirements

- **Accessibility:** WCAG 2.1 AA on all public pages.
- **Performance:** Landing page LCP < 2.5s; admin panel not held to the same bar but should not block on synchronous vendor calls.
- **Security:** HTTPS everywhere, secrets in a vault/secret manager (not `.env` in git), rate limiting on all public forms and auth endpoints, CSRF protection, dependency scanning in CI.
- **Audit logging:** every admin write action logged (Section 4); every reserve-ledger change immutable/append-only; every payroll-benefit attestation and threshold-check decision immutable/append-only (Section 8).
- **Internationalization:** structure copy for i18n from day one (even if only English ships first) given the cross-border target market; German is a first-class language requirement for Section 8, not an afterthought translation.
- **Environments:** separate `dev`, `staging`, `production` with distinct API keys and `RESERVE_LIVE=false` everywhere except a fully vetted production custody integration.

---

## 10. Suggested build order (milestones)

1. Auth + role scaffolding (seed `super_admin`), basic admin shell with feature flags.
2. Landing page + waitlist form + investor form (fully functional, no wallet logic yet).
3. Admin views for waitlist/investor pipelines + content CMS hookup.
4. Customer auth + dashboard shell with mocked wallet data (`RESERVE_LIVE=false`).
5. Price-data integration (Section 5.1) powering a live "gold price" display.
6. KYC vendor integration + admin KYC review queue.
7. Custody/vault partner integration + reserve ledger + admin reserve dashboard (only after legal/custodian agreements are signed).
8. ZKP proof-of-reserve layer + public proof-of-reserve dashboard.
9. Payment rails (NFC/QR/P2P) — mobile app scope, likely a separate React Native/Flutter build consuming the same backend API.
10. **Gold as a Service (Section 7), phased:** (a) store locator + partner application/onboarding + Partner Panel UI, with `CROSS_BORDER_LIVE=false` everywhere — this alone lets partner recruitment start before any money moves; (b) sender/recipient flow UI end-to-end against mocked transfers; (c) enable one pilot corridor's `CROSS_BORDER_LIVE` flag only after that corridor's money-transmitter/agent licensing, AML/sanctions-screening integration, and partner agreements are actually in place.
11. **AURIX for Payroll (Section 8), phased — can run in parallel with, or ahead of, milestone 10:** (a) employer onboarding flow (Section 8.1) + employer portal UI + admin approval queue, with `PAYROLL_BENEFIT_LIVE=false` everywhere (mocked grants, real KYB/attestation flow so the pipeline of interested employers can start building now); (b) wire real BPC minting to actual grants once the custody layer (milestone 7) is live; (c) DATEV export + a Steuerberater/payroll-software co-marketing relationship; (d) enable `PAYROLL_BENEFIT_LIVE` for Germany, then Austria, only once legal review of the attestation/threshold mechanics is signed off.

---

*This document specifies what to build and in what order; it does not itself grant any account access, license any third-party API, or represent that any custody or audit relationship currently exists. Steps 7–8, 10(c), and 11(d) in particular require signed legal/custodian/licensing agreements before implementation of live money movement or live payroll-benefit grants begins.*
