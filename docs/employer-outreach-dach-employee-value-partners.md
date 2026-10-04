# AURIX employee-value partners — DACH outreach (Flink, SCHUFA, n8n, Auto1, Personio)

**Positioning:** AURIX is seeking **partners and companies** who want to bring **big, tangible value to their employees** — not a generic vendor blast. The offer is **AURIX for Payroll**: a tax-advantaged gold *Sachbezug* benefit (BPC) that employees can feel (real ownership, savings habit, inflation hedge), granted **on top of salary**, never as a substitute.

**Status gate:** `PAYROLL_BENEFIT_LIVE` is **OFF** for DE/AT. Frame every ask as **partnership exploration / pilot waitlist interest**. Do **not** claim live payroll gold grants.

**Compliance (include in every send):** AURIX is not tax or legal advice. Confirm current thresholds and eligibility with the employer’s own *Steuerberater*. Benefit must meet the *Zusätzlichkeitserfordernis* (additional to salary).

**Send status (2026-10-02):** **Sent** from `contact@aurixapp.de` (Prof. Dr. Ahmed Ebada / AURIX) to all 5 shortlist inboxes via Hostinger SMTP. CRM lead notes updated with timestamp + Message-ID. See `docs/aurix-employee-value-partners-send-log.json`.

**Product page:** https://aurixapp.de/for-business/payroll/  
**Contact for replies:** contact@aurixapp.de

---

## Shortlist — official channels (no invented personal emails)

| Company | Why them | Type | Official contact URLs / inboxes | CRM lead |
|---------|----------|------|---------------------------------|----------|
| **Flink** | Quick commerce; HQ + hub/rider workforce that feels “extra cash” benefits | Employer / employee-value partner | Careers: https://careers.smartrecruiters.com/Flink3/joinus · Imprint: https://www.goflink.com/en/imprint · `contact@goflink.com` (also press/supplier/ridercare on imprint) | [#24208](https://munichtechexpo.com/back/admin/outreach/leads/24208) |
| **SCHUFA** | Regulated DE employer; trust & compliance culture | Employer / employee-value partner | Careers FAQ: https://www.schufa.de/ueber-uns/karriere/faq-karriere/index.jsp · `jobs@schufa.de` · Imprint: https://www.schufa.de/global/impressum/ · `presse@schufa.de` | [#24209](https://munichtechexpo.com/back/admin/outreach/leads/24209) |
| **n8n** | Berlin SaaS; talent competition; builders who value ownership | Employer / employee-value partner | Contact hub: https://n8n.io/contact/ · `partners@n8n.io` · `marketing@n8n.io` · Careers via Ashby job board | [#23126](https://munichtechexpo.com/back/admin/outreach/leads/23126) |
| **AUTO1 Group** | Large Berlin HQ + Europe ops; differentiation in Total Rewards | Employer / employee-value partner | Careers: https://www.auto1-group.com/careers/ · Imprint: https://www.auto1-group.com/imprint/ · `info@auto1-group.com` · `press@auto1-group.com` | [#377](https://munichtechexpo.com/back/admin/outreach/leads/377) |
| **Personio** | HR/payroll platform for DACH SMEs **+** large employer itself | **Dual:** product/channel partner **and** employer | Partner programme: https://www.personio.com/partner/ · https://www.personio.de/partner/ · `integration-partner@personio.com` · Marketplace: https://www.marketplace.personio.com · Careers: https://www.personio.com/about-personio/careers/ · Product-partner steps: https://support.personio.de/hc/en-us/articles/360011430518-First-steps-towards-a-product-partnership-with-Personio | [#32](https://munichtechexpo.com/back/admin/outreach/leads/32) |

**LinkedIn (route via company People / Total Rewards / Comp & Benefits — do not invent names):**  
Search company page → People → titles like *Head of People*, *Total Rewards*, *Compensation & Benefits*, *People Operations*. Prefer InMail to role, not guessed `@company` personal addresses.

---

## MunichTech EXPO CRM (production)

| Item | Value |
|------|--------|
| Project path | `/Volumes/All/Dev/MunichTech EXPO` |
| Upsert endpoint | `https://munichtechexpo.com/back/admin/upsert-outreach-lead` |
| Admin CRM | `https://munichtechexpo.com/back/admin/outreach/leads/{id}` |
| Source tag | `aurix-employee-value-partners` |
| Upsert log | `docs/aurix-employee-value-partners-crm-log.json` |
| Result | **5/5 success** (2026-10-02) — Flink & SCHUFA **created**; n8n, AUTO1, Personio **updated** (existing leads, notes appended) |

Secrets were not printed. No email was sent from the CRM upsert.

---

## Employee-facing hook (reuse everywhere)

Use this so HR *sees why staff would love it* — employees first, employer ROI second:

> Imagine opening your wallet and seeing **real gold savings** from your employer — not another voucher that expires, not points you’ll forget. A small monthly allotment of physical-backed digital gold (BPC), granted **on top of your salary**, that you own, that can help hedge inflation, and that builds a savings habit you can actually feel. That’s the employee experience AURIX for Payroll is built for.

German short variant:

> Stell dir vor, in deiner Wallet liegt **echtes Gold-Sparen vom Arbeitgeber** — zusätzlich zum Gehalt, nicht als Ersatz. Kleine, wiederkehrende Gold-Zuwendung (BPC) als Sachbezug: greifbarer Wert, Inflationsschutz-Idee, echtes Eigentum — kein ablauffähiger Gutschein.

---

## Reusable employer BD email (HR / People / Comp & Benefits)

**Subject options:**
1. Partners who want to deliver real value to employees — gold Sachbezug (pilot waitlist)
2. Employee benefit idea: tax-advantaged gold on top of salary (DE/AT)
3. For your people: owned gold savings as a modern Sachbezug

**Body:**

```
Subject: Partners who want to deliver real value to employees — gold Sachbezug

Hello {{People / Total Rewards team}},

AURIX is looking for partners and companies that want to bring big, tangible value to their employees — not another forgettable perk.

We’re exploring early partnerships around AURIX for Payroll: a gold Sachbezug / Sachzuwendung benefit for German and Austrian employers. Employees receive a small, recurring allotment of gold (administered digitally as BPC) that they can see in their wallet — real ownership, a savings habit, and an inflation-aware asset — granted in addition to salary, never as a substitute.

Why employees tend to love it
• Real gold savings they own (not points that expire)
• Clear “my employer invests in my future” signal
• Complements cash compensation instead of competing with it

Why employers consider it
• Targets the well-known ~€50/employee/month non-cash benefit framing (and a separate annual lump-sum regime up to ~€10,000/employee/year at a flat employer-side rate) — always confirm current law with your Steuerberater; this is not tax advice
• Worked framing: €50/month/employee in gold vs. an equivalent net cash raise typically costs more in gross pay + employer social contributions (exact math depends on bracket — your advisor owns that)
• Additionality is a hard product rule (Zusätzlichkeitserfordernis): we will not build salary-reduction controls into the grant flow

Where we are today
Live gold grants are not enabled yet (certification / custody gate). We’re building a waitlist of employers who want to shape a pilot and be first in line when PAYROLL_BENEFIT_LIVE turns on for DE (then AT).

Would you be open to a short intro call with People / Comp & Benefits — or shall I send a one-pager for your Steuerberater to review?

Product overview: https://aurixapp.de/for-business/payroll/
Reply: contact@aurixapp.de

Best regards,
{{Your name}}
AURIX — Employee-value partnerships

Disclaimer: AURIX provides tools to help administer this benefit. We are not your tax advisor. Confirm thresholds and eligibility with your own Steuerberater before any payroll or tax filing decision. Benefit must be additional to salary.
```

---

## Customized variants

### 1) Flink — delivery + HQ culture

**Angle:** Your people move fast for customers; a benefit that feels *owned and real* resonates with hub associates, riders (where employment model allows), and HQ alike — something stronger than another short-term perk.

**Opening swap (after greeting):**

```
Flink’s teams — from hubs to HQ — live in a high-tempo environment where retention and belonging matter. We’re seeking employers who want to give employees something they can feel: owned gold savings on top of salary, not another voucher that disappears.
```

**Soft ask:** Intro with People / Workplace Experience / Total Rewards; pilot waitlist for DE HQ first.

**Send via:** `contact@goflink.com` (ask to forward to People) **or** LinkedIn People/Total Rewards at Flink **or** careers portal networking — do not invent rider personal emails. Prefer HQ employment population for payroll Sachbezug; clarify contractor/rider eligibility with counsel.

---

### 2) SCHUFA — trust & compliance culture

**Angle:** A credit-trust institution’s people expect benefits that are serious, documented, and compliant — gold Sachbezug with additionality attestation and export-ready documentation fits that bar.

**Opening swap:**

```
SCHUFA’s people work at the intersection of trust, data, and financial life in Germany. We’re looking for employers who want to elevate employee benefits with something equally tangible and compliance-minded: a tax-advantaged gold Sachbezug — additional to salary — that employees own in-wallet, with documentation their Steuerberater can review.
```

**Soft ask:** Forward to Compensation & Benefits / People; optional Steuerberater review before any pilot talk.

**Send via:** `jobs@schufa.de` only as a **routing ask** (“please forward to Total Rewards / Comp & Benefits — partnership, not a job application”) **or** LinkedIn People leadership. Prefer not to use `presse@` for benefits BD.

---

### 3) n8n — tech talent who value ownership

**Angle:** Automation builders already think in ownership and leverage; gold in the wallet is a benefit that matches a builder mindset and helps compete for talent in Berlin.

**Opening swap:**

```
n8n’s team builds tools that give people leverage. We’re seeking companies that want to give their own people leverage of a different kind: a modern employee benefit — owned gold savings as a Sachbezug — on top of salary, designed to feel as real as the product they ship.
```

**Soft ask:** People Operations / Total Rewards intro; pilot waitlist for DE-based employees first.

**Send via:** `partners@n8n.io` with clear subject “People / employee benefit — please route” **or** LinkedIn People Ops. Careers board is apply-only; use People titles on LinkedIn for InMail.

---

### 4) AUTO1 Group — scale differentiation in Total Rewards

**Angle:** At marketplace scale, benefits are a culture signal. Gold ownership is a rare, memorable differentiator across HQ and country teams.

**Opening swap:**

```
AUTO1 Group competes for talent across Berlin HQ and Europe. We’re looking for employers who want a benefit employees actually talk about: tax-advantaged gold as a Sachbezug — real ownership in their wallet, additional to salary — as a distinctive line in Total Rewards.
```

**Soft ask:** HR Business Partner / Total Rewards intro; pilot waitlist for Germany first.

**Send via:** `info@auto1-group.com` (forward to People) **or** LinkedIn People Germany / Total Rewards. Careers: https://www.auto1-group.com/careers/

---

### 5) Personio — dual track (channel + employer)

Personio is strategic in AURIX payroll docs (co-marketing / referral with payroll software: DATEV, Personio, sage).

#### 5a) Product / partner programme email

**Subject:** Complementary employee benefit for Personio customers — gold Sachbezug (early partnership)

```
Hello Personio Partner / Integrations team,

AURIX is looking for partners who want to help employers deliver big value to employees.

We build AURIX for Payroll: a gold Sachbezug benefit for German/Austrian employers — employees receive a small recurring gold allotment (BPC) they own in-wallet, on top of salary. Live grants are gated off until certification; we’re opening a partnership conversation now.

Why this fits Personio’s ecosystem
• Complementary to HR/payroll — not a competing HCM
• Aimed at the same DACH SME customers who already care about benefits, compliance, and employee experience
• Roadmap interest in Steuerberater / payroll-software co-marketing and referral (alongside DATEV, sage)
• Clear compliance posture: additionality required; AURIX is not tax advice

We’re interested in exploring: marketplace listing path, referral/co-marketing, or a lightweight integration story once our employer portal and export rails mature.

Could we book a short partnership intro? Happy to also connect with your People team — Personio as an employer is a natural pilot for the same benefit.

Overview: https://aurixapp.de/for-business/payroll/
Partner contact preference: integration-partner@personio.com / https://www.personio.com/partner/

Best regards,
{{Your name}}
AURIX — Employee-value & platform partnerships
```

#### 5b) Personio-as-employer email (People)

Use the reusable BD email with this opening:

```
Personio helps thousands of companies take better care of their people — we’re seeking employers (including Personio itself) who want to deliver an equally tangible benefit inside their own walls: owned gold savings as a modern Sachbezug, additional to salary.
```

**Send via:** Partner form https://www.personio.com/partner/ **and/or** `integration-partner@personio.com` for channel; LinkedIn People / Total Rewards for employer track. Careers page is for applicants, not BD.

---

## Optional LinkedIn InMail (short)

**Generic:**

```
Hi {{Name}} — AURIX is looking for companies that want to deliver real value to employees. We’re exploring a DE/AT gold Sachbezug benefit (owned gold in-wallet, on top of salary — not a salary swap). Live grants aren’t on yet; we’re inviting People/Total Rewards teams onto a pilot waitlist. Open to a 15-min intro? https://aurixapp.de/for-business/payroll/
```

**Personio (partner + people):**

```
Hi {{Name}} — exploring two paths with Personio: (1) complementary gold Sachbezug benefit for DACH customers via partner/referral, (2) same benefit for Personio’s own team. Employee-first value, compliance-safe additionality, pilot waitlist only (not live grants yet). Worth a short intro?
```

**Flink:**

```
Hi {{Name}} — for Flink’s people (HQ + ops): a benefit they can feel — owned gold savings as Sachbezug, additional to salary. Seeking People partners who want big employee value. Pilot waitlist / intro?
```

---

## Worked numbers (careful framing — not tax advice)

| Plan framing | Rough threshold (confirm with Steuerberater) | Employee feel |
|--------------|-----------------------------------------------|---------------|
| Monthly | ~€50 / employee / month tax- and social-security-free non-cash framing | Steady gold savings habit in wallet |
| Annual lump sum | Up to ~€10,000 / employee / year flat-rate employer-side regime (mutually exclusive with monthly per employee) | Larger ownership moment |

**Employer economics (illustrative only):** €50/month gold vs. delivering the same *net* via cash raise usually costs more in gross salary + employer social contributions. Exact savings depend on the employee’s tax bracket — the employer’s *Steuerberater* owns that math.

---

## Suggested next steps for you (human send)

1. Open each CRM lead in MTE admin (links in shortlist) and assign an owner.
2. Customized emails were sent from `contact@aurixapp.de` (2026-10-02) — see send log for Message-IDs.
3. For Personio: submit the [Partner Programme form](https://www.personio.com/partner/) **and** email `integration-partner@personio.com`; separately InMail People for employer track.
4. Prefer LinkedIn People/Total Rewards when shared inboxes (`contact@`, `info@`, `jobs@`) are weak for BD.
5. Keep waitlist CTA: https://aurixapp.de/for-business/payroll/
6. Before any “we’re live” language: confirm `PAYROLL_BENEFIT_LIVE` for DE.

---

## Explicit non-actions / send gate

- **2026-10-02:** outreach emails **sent** from `contact@aurixapp.de` to Flink, SCHUFA, n8n, AUTO1, Personio (see send log). SMTP password used only as process env; not written to repo.
- No partner forms were submitted (Personio partner web form still optional follow-up).
- No personal employee emails were invented.
- No claim that payroll gold grants are live.
- Deploy/CRM keys and mailbox password were not printed.
)
