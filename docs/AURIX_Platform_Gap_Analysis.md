# AURIX Platform — Gap analysis (vs Implementation Requirements)

Snapshot against milestones 1–11 after the Milestone 1–2 foundation slice.
Source spec: `docs/AURIX_Platform_Implementation_Requirements.md`.

## Already existed (before / reinforced this pass)

| Area | Status |
|---|---|
| Marketing site (`apps/website`, static export) | Strong — landing, how-it-works, pricing, markets, i18n (en/de/ar), chrome |
| Gold-as-a-Service UI | `/send`, `/track`, `/partners`, `/partner-with-us`, `/partner/*` practice flows |
| Practice store | Client localStorage; `CROSS_BORDER_LIVE` / `reserveLive` gated in gold-service store |
| Waitlist + investors pages | Present; previously thin forms → localStorage / PHP inquiry |
| Customer practice app | `/app/*` mocked wallets |
| Admin app (`apps/admin`) | Login + dashboard shell, users/KYC via backend RBAC |
| Backend (`services/backend`) | Express mock-db, JWT auth, roles, admin KYC/users |

## Added in this foundation slice

| Item | Location |
|---|---|
| Spec persisted | `docs/AURIX_Platform_Implementation_Requirements.md` |
| Feature flags module | `apps/website/src/lib/feature-flags.ts` + CertificationBanner |
| Prisma schema + seed stubs | `services/backend/prisma/` (SQLite-ready; runtime still mock-db) |
| Public waitlist/investor APIs | `POST /public/waitlist`, `POST /public/investors` |
| Admin waitlist / investors / flags API | `/admin/waitlist`, `/admin/investors`, `/admin/feature-flags` |
| Super-admin seed email | `engahmed2055@gmail.com` in mock-db (+ Prisma seed) |
| Form field completeness | Waitlist §3.1, investor §3.2 (honeypot + rate-limit) |
| Payroll landing | `/for-business/payroll` gated by `PAYROLL_BENEFIT_LIVE` |
| Admin UI | Waitlist list, investor pipeline, wired settings flags |

## Still missing (by milestone)

1. **Auth provider choice** — php-auth + JWT mock; not Auth.js/Clerk; roles in mock-db only until Prisma wired  
2. **Milestone 3** — CMS, richer waitlist/investor admin, email (Resend)  
3. **Milestone 4+** — Real dashboard money APIs (keep `RESERVE_LIVE=false`)  
4. **5–8** — Price provider, KYC vendor, custody, ZKP  
5. **9** — Mobile payment rails  
6. **10c / 11d** — Live corridor / live payroll grants (legal blockers)  
7. **Website static export** — no Next API routes; backend or PHP required for persistence  
8. **Employer portal** `/employer/*`, payroll admin queues, DATEV — not started  

## Ground rules status

- `RESERVE_LIVE`, `CROSS_BORDER_LIVE` (per corridor), `PAYROLL_BENEFIT_LIVE` (DE/AT) default **OFF**
- No live custody / remittance / payroll grant claims in UI copy
