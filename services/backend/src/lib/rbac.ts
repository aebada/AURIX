/**
 * AURIX RBAC — same style as MunichTech EXPO `config/rbac.php`:
 * named staff roles, participant personas, permission slugs, super_admin = *.
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

export const PARTICIPANT_ROLES: Role[] = ["user", "partner", "investor", "employer"];

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

export type Permission =
  | "users.view_all"
  | "users.manage"
  | "users.assign_roles"
  | "users.assign_super_admin"
  | "settings.system"
  | "financial.view_all"
  | "financial.manage"
  | "kyc.view"
  | "kyc.manage"
  | "aml.view"
  | "aml.manage"
  | "investors.view"
  | "investors.manage"
  | "partners.view"
  | "partners.manage"
  | "payroll.view"
  | "payroll.manage"
  | "reserves.view"
  | "content.manage"
  | "reports.view"
  | "reports.export";

const ROLE_PERMISSIONS: Record<Role, Permission[] | "*"> = {
  super_admin: "*",
  operations_manager: [
    "users.view_all",
    "kyc.view",
    "kyc.manage",
    "partners.view",
    "partners.manage",
    "payroll.view",
    "reports.view",
  ],
  admin: [
    "users.view_all",
    "kyc.view",
    "kyc.manage",
    "partners.view",
    "partners.manage",
    "payroll.view",
    "reports.view",
  ],
  sales_partnerships: [
    "investors.view",
    "investors.manage",
    "partners.view",
    "partners.manage",
    "reports.view",
  ],
  finance: [
    "financial.view_all",
    "financial.manage",
    "reserves.view",
    "payroll.view",
    "payroll.manage",
    "reports.view",
    "reports.export",
  ],
  marketing: ["investors.view", "investors.manage", "content.manage", "reports.view"],
  compliance_officer: ["kyc.view", "kyc.manage", "aml.view", "aml.manage", "reserves.view", "users.view_all"],
  support: ["users.view_all", "kyc.view", "investors.view", "partners.view", "payroll.view", "reports.view"],
  user: [],
  partner: ["partners.view"],
  investor: ["investors.view"],
  employer: ["payroll.view"],
};

export const SUPER_ADMIN_ONLY: Permission[] = [
  "users.assign_super_admin",
  "settings.system",
  "users.manage",
  "financial.view_all",
];

export function isFounderEmail(email: string): boolean {
  return email.trim().toLowerCase() === SUPER_ADMIN_EMAIL;
}

export function roleForEmail(email: string, fallback: Role = "user"): Role {
  return isFounderEmail(email) ? "super_admin" : fallback;
}

export function isStaffRole(role: Role): boolean {
  return STAFF_ROLES.includes(role);
}

export function hasPermission(role: Role, permission: Permission): boolean {
  if (SUPER_ADMIN_ONLY.includes(permission) && role !== "super_admin") return false;
  const granted = ROLE_PERMISSIONS[role];
  if (granted === "*") return true;
  return granted.includes(permission);
}

export function normalizeRole(role: string | undefined | null): Role {
  if (role && (ROLES as readonly string[]).includes(role)) return role as Role;
  return "user";
}
