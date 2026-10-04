# Platform data model (Prisma scaffolding)

Schema + seed live here for **Milestone 1–2**. Runtime API still uses
`src/data/mock-db.ts` so local/dev works without a database.

## Optional: enable SQLite locally

```bash
cd services/backend
npm install
echo 'DATABASE_URL="file:./dev.db"' >> .env
npx prisma migrate dev --name init
npm run db:seed
```

Seed creates `super_admin` for `engahmed2055@gmail.com` and default feature
flags (`RESERVE_LIVE`, `CROSS_BORDER_LIVE`, `PAYROLL_BENEFIT_LIVE`) all **OFF**.

`MetalOrder` (quoted → paid → allocated → minted → settled, plus cancelled/failed)
is scaffolding for London connectors. Runtime seed lives in `mock-db.ts`;
minted/settled must not be used until signed custody + `RESERVE_LIVE`.

Wire Prisma into route handlers in a later milestone; do not claim live custody
or remittance when flipping flags.
