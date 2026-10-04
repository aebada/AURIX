# Competitive comparison: Moss vs AURIX vs Invoice AI

**Audience:** Founder / BD  
**Date:** 2026-10-02  
**Sources:** [getmoss.com](https://www.getmoss.com/), [getmoss.com/pricing](https://www.getmoss.com/pricing), [getmoss.com/corporate-credit-card](https://www.getmoss.com/corporate-credit-card); live [aurixapp.de](https://aurixapp.de) + AURIX repo (`docs/`, payroll landing); Invoice AI at `/Volumes/All/Dev/InvoiceAI` (HOPn / MunichTech ecosystem — pitch deck + README).  
**Accuracy note:** Moss features below are taken from public marketing only — no invented capabilities. Invoice AI is **your** product (`invoice.ehopn.com`, HOPn Buchloe/Munich), not a random third party.

---

## One-line positioning

| Product | Positioning |
|--------|-------------|
| **Moss** | Finance AI / spend management: corporate cards, invoices, reimbursements, and AP → ERP/DATEV in one EU platform. |
| **AURIX** | Gold-linked digital money + wallet: BPC ownership, Gold-as-a-Service, and DE/AT gold *Sachbezug* payroll benefit (practice today; live custody/grants gated). |
| **Invoice AI** | HOPn’s intelligent finance OS: invoice capture → books → approvals → DATEV → AI CFO (EU core, GCC e-invoicing thesis). |

---

## Target customer

| | Moss | AURIX | Invoice AI |
|--|------|-------|------------|
| **Primary buyer** | Finance / ops at EU SMBs & growing companies (~7,500+ EU businesses claimed) | Employers (People / Total Rewards / Comp) in DE/AT; also B2C savers & B2B2C gold partners | Finance / accounting at SMEs needing AP automation + German tax handoff |
| **Buyer pain** | Messy spend, missing receipts, slow month-end | Weak employee value vs cash raises; inflation/savings narrative | Manual invoice entry, slow close, DATEV/VAT burden |
| **Geo** | EU (strong DE DATEV angle; UK/EU cards) | DE/AT payroll first; MEA gold corridors on roadmap | EU today; GCC expansion in pitch |
| **Stage** | Scaled commercial SaaS + card issuing | Practice / waitlist; `PAYROLL_BENEFIT_LIVE` off; custody certification gated | Built Laravel product + investor pitch; Hostinger-deployable; sister to MunichTech/HOPn stack |

---

## Core job-to-be-done

| Product | JTBD |
|--------|------|
| **Moss** | “Control and account for how the company **spends** — cards, invoices, claims — with AI coding into our ERP.” |
| **AURIX** | “Give people **owned gold value** (wallet / remittance partners / tax-aware payroll benefit) instead of another fiat promise or voucher.” |
| **Invoice AI** | “Turn invoices and finance documents into **books, compliance, and CFO insight** without a full Moss-scale card stack.” |

**Employee “benefit” vs spend control (critical distinction)**  
- Moss “Employee Reimbursements” = **expense claims** (mileage, per diems, out-of-pocket) — **not** a fringe / *Sachbezug* product.  
- AURIX Payroll = **employer-granted gold on top of salary** (~€50/mo or ~€10k/yr regimes), additionality attested.  
- Invoice AI = back-office AP/accounting — no employee gold benefit.

---

## Overlap vs complementary

```
                    SPEND / AP / BOOKS          VALUE / SAVINGS / GOLD
                 ┌─────────────────────┐    ┌─────────────────────────┐
  Moss           │ Cards + AP + AI     │    │           —             │
  Invoice AI     │ AP + books + AI CFO │    │           —             │
  AURIX          │ DATEV export (plan) │    │ Wallet, GaaS, Sachbezug │
                 └─────────────────────┘    └─────────────────────────┘
```

| Pair | Relationship |
|------|----------------|
| **Moss ↔ AURIX** | **Complementary.** Same DACH SMB buyer org, different budget owners (Finance vs People/Rewards). Moss customers can still want AURIX gold payroll. |
| **Invoice AI ↔ AURIX** | **Complementary (sister products).** Invoice AI owns AP/books; AURIX owns gold benefit + wallet. Shared DATEV/Steuerberater narrative possible later. |
| **Moss ↔ Invoice AI** | **Competitive overlap** on invoice AP, AI pre-accounting, approvals, DATEV/ERP sync. Moss wins on cards + scale; Invoice AI can differentiate on AI CFO depth, Hostinger/SME cost, EN/DE/AR, GCC e-invoice thesis — **not** on Mastercard issuing today. |

**Can Moss / Invoice AI customers also want AURIX gold payroll?**  
**Yes.** Controlling spend (Moss) or processing invoices (Invoice AI) does not satisfy “give employees owned gold as *Sachbezug*.” Same company can run Moss *and* enroll in AURIX for Payroll. Pitch AURIX to People/Total Rewards, not as a Moss replacement.

---

## Feature matrix

| Capability | Moss | AURIX | Invoice AI |
|------------|:----:|:-----:|:----------:|
| Corporate cards (physical/virtual) | Yes | No | No |
| Spend limits / budgets / procurement | Yes | No | Partial (approvals; no card rails) |
| Invoice / AP capture & workflow | Yes | No | Yes |
| Employee reimbursements (expense claims) | Yes | No | No (not core) |
| Accounting / GL / VAT | Yes (pre-accounting → ERP) | Planned DATEV export for benefit docs | Yes (journals, TB, P&L) |
| DATEV / DE Steuerberater handoff | Yes (marketed) | Planned for payroll grants | Yes (Buchungsstapel CSV) |
| Gold / metal savings / BPC wallet | No | Yes (practice; live gated) | No |
| Payroll fringe / *Sachbezug* benefit | No | Yes (DE/AT; live grants gated) | No |
| Gold-as-a-Service / partner pickup | No | Yes (practice corridors) | No |
| AI (docs, coding, CFO) | Yes (“Finance AI”, coding claims) | Governance / fraud roadmap; practice insights | Yes (agents, CFO chat, digests) |
| HR integrations (onboarding users) | Yes (claimed) | Employer KYB / apply; Personio channel intended | Org/roles; not HRIS-native |
| Pricing angle (public) | Modular platform fee + **transaction volume**; unlimited users; start free w/ Cards or AP | B2B payroll platform + asset spread / partner fees (model); early-access waitlist | B2B SaaS (pitch: Pilot/Growth/Enterprise via Customer Twin catalog) |

---

## Competitive threat level **to AURIX**

| Player | Threat to AURIX | Why |
|--------|-----------------|-----|
| **Moss** | **Low** | Different JTBD. No public gold, savings, or *Sachbezug* product. Risk only if Moss later ships “employee benefits marketplace” and bundles a gold partner — even then AURIX can be that partner. |
| **Invoice AI** | **None (internal)** | Same founder/ecosystem. Threat is only **attention dilution** if both chase the same Moss-like AP GTM. |
| **Moss → Invoice AI** | High (for Invoice AI) | Moss is the scaled category leader Invoice AI would meet in AP+AI. Separate from AURIX strategy. |

---

## Partnership opportunity

| Motion | Fit | Notes |
|--------|-----|-------|
| **Moss as channel for AURIX Payroll** | Medium–High | Moss already sells into EU finance teams + HR user sync. Complementary add-on: “spend stack + gold employee benefit.” Analogous to planned **Personio** partner/referral path in `docs/employer-outreach-dach-employee-value-partners.md`. Approach: marketplace / referral / co-sell to People teams at Moss accounts — not “replace Moss.” |
| **Invoice AI as channel / stack mate for AURIX** | High (internal) | Shared HOPn brand, DATEV story, DACH SMEs. Invoice AI customers’ Steuerberater touchpoint can introduce AURIX Payroll; AURIX employers may need AP tooling separately. Do **not** position Invoice AI against AURIX. |
| **AURIX compete head-on with Moss** | Poor | Cards + AP require licensing, capital, and category spend AURIX should not divert from custody + payroll certification. |
| **Invoice AI compete with Moss** | Optional / hard | Only if Invoice AI GTM explicitly chooses AP niche (price, AI CFO, GCC). Do not pull AURIX into that fight. |

---

## Recommendation

**Stay in different lanes; partner where buyers overlap.**

1. **AURIX vs Moss → Partner / stay different lane**  
   Do not build cards or general spend management. Treat Moss (and Personio) as **distribution** for gold *Sachbezug* once `PAYROLL_BENEFIT_LIVE` and custody allow credible pilots. Message: employee value **on top of** controlled spend, not instead of it.

2. **AURIX vs Invoice AI → Complementary sister products**  
   Keep AURIX = gold / wallet / payroll benefit; Invoice AI = AP / books / AI CFO. Shared CRM (MunichTech), DATEV language, and employer intros — not a three-way market fight.

3. **Invoice AI vs Moss → Compete selectively (Invoice AI’s problem)**  
   Moss owns cards + scale. Invoice AI should win on focused AP intelligence, explainable agents, DE/AR, and cost-to-serve — or partner/integrate rather than “be Moss.”

4. **Founder priority for AURIX**  
   Certification + employer waitlist quality > feature parity with Moss. Every BD conversation that starts as “vs Moss” should be reframed as “Moss for spend; AURIX for owned-gold employee value.”

---

## Quick reference URLs

- Moss: https://www.getmoss.com/  
- AURIX: https://aurixapp.de/ · Payroll: https://aurixapp.de/for-business/payroll/  
- Invoice AI: product repo `/Volumes/All/Dev/InvoiceAI` · pitch cites **invoice.ehopn.com** · HOPn (Buchloe / Munich)

---

*Internal competitive note only. Not tax, legal, or investment advice. Do not claim live AURIX custody or live payroll grants until country flags and partners allow it.*
