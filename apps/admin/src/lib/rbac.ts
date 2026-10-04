/**
 * Mirrors services/backend/src/lib/rbac.ts for the admin UI
 * (MunichTech EXPO role style).
 */

export const SUPER_ADMIN_EMAIL = "engahmed2055@gmail.com";

export const ROLES = [
  "super_admin",
  "operations_manager",
  "sales_partnerships",
  "finance",
  "marketing",
  "compliance_officer",
  "support",
  "admin",
  "user",
  "partner",
  "investor",
  "employer",
] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "SUPER_ADMIN",
  operations_manager: "Operations Manager",
  sales_partnerships: "Sales & Partnerships",
  finance: "Finance",
  marketing: "Marketing",
  compliance_officer: "Compliance Officer",
  support: "Support",
  admin: "Operations Manager",
  user: "User",
  partner: "Partner",
  investor: "Investor",
  employer: "Employer",
};

export const STAFF_ROLES: Role[] = [
  "super_admin",
  "operations_manager",
  "sales_partnerships",
  "finance",
  "marketing",
  "compliance_officer",
  "support",
  "admin",
];

export const ASSIGNABLE_ROLES: Role[] = [
  "super_admin",
  "operations_manager",
  "sales_partnerships",
  "finance",
  "marketing",
  "compliance_officer",
  "support",
  "user",
  "partner",
  "investor",
  "employer",
];

export function isStaffRole(role: Role): boolean {
  return STAFF_ROLES.includes(role);
}
