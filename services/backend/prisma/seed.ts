/**
 * Prisma seed — Milestone 1.
 * Creates super_admin for engahmed2055@gmail.com and default feature flags (all OFF).
 *
 * Run: DATABASE_URL="file:./dev.db" npx prisma db seed
 * (Requires: npm i -D prisma tsx && npm i @prisma/client && npx prisma migrate dev)
 */

import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

const SUPER_ADMIN_EMAIL = "engahmed2055@gmail.com";

const DEFAULT_FLAGS: Record<string, unknown> = {
  RESERVE_LIVE: false,
  MAINTENANCE_MODE: false,
  CROSS_BORDER_LIVE: {
    "SA-EG": false,
    "AE-EG": false,
    "KW-EG": false,
    "QA-EG": false,
    "AE-SA": false,
    "SA-AE": false,
  },
  PAYROLL_BENEFIT_LIVE: { DE: false, AT: false },
};

async function main() {
  await prisma.user.upsert({
    where: { email: SUPER_ADMIN_EMAIL },
    update: { role: Role.super_admin, name: "Ahmed" },
    create: {
      email: SUPER_ADMIN_EMAIL,
      name: "Ahmed",
      role: Role.super_admin,
      emailVerified: new Date(),
    },
  });

  for (const [key, value] of Object.entries(DEFAULT_FLAGS)) {
    await prisma.featureFlag.upsert({
      where: { key },
      update: {},
      create: {
        key,
        value: JSON.stringify(value),
        updatedBy: SUPER_ADMIN_EMAIL,
      },
    });
  }

  const year = new Date().getFullYear();
  for (const country of ["DE", "AT"] as const) {
    await prisma.payrollThreshold.upsert({
      where: {
        country_taxYear_planType: {
          country,
          taxYear: year,
          planType: "monthly",
        },
      },
      update: {},
      create: {
        country,
        taxYear: year,
        planType: "monthly",
        limitValue: 50,
        effectiveFrom: new Date(`${year}-01-01`),
        updatedBy: SUPER_ADMIN_EMAIL,
      },
    });
    await prisma.payrollThreshold.upsert({
      where: {
        country_taxYear_planType: {
          country,
          taxYear: year,
          planType: "annual",
        },
      },
      update: {},
      create: {
        country,
        taxYear: year,
        planType: "annual",
        limitValue: 10000,
        effectiveFrom: new Date(`${year}-01-01`),
        updatedBy: SUPER_ADMIN_EMAIL,
      },
    });
  }

  console.log(`Seeded super_admin ${SUPER_ADMIN_EMAIL} and default feature flags (all OFF).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
