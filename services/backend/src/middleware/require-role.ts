import type { NextFunction, Request, Response } from "express";
import { db } from "../data/mock-db.js";
import {
  hasPermission,
  isStaffRole,
  normalizeRole,
  type Permission,
  type Role,
} from "../lib/rbac.js";

export function requireStaff() {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.auth?.sub ? db.users.get(req.auth.sub) : undefined;
    if (!user) return res.status(401).json({ error: "Not authenticated" });
    if (!isStaffRole(normalizeRole(user.role))) {
      return res.status(403).json({ error: "Staff role required" });
    }
    next();
  };
}

export function requirePermission(permission: Permission) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.auth?.sub ? db.users.get(req.auth.sub) : undefined;
    if (!user) return res.status(401).json({ error: "Not authenticated" });
    if (!hasPermission(normalizeRole(user.role), permission)) {
      return res.status(403).json({ error: "Insufficient role for this action" });
    }
    next();
  };
}

/** Legacy min-tier gate used by existing routes. */
export function requireRole(minRole: Role) {
  if (minRole === "super_admin") return requirePermission("users.assign_super_admin");
  if (minRole === "admin") return requirePermission("kyc.manage");
  return requireStaff();
}
