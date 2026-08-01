import type { NextFunction, Request, Response } from "express";
import { db, type Role } from "../data/mock-db.js";

// Ranked low to high so a route can require a minimum tier ("admin"
// also satisfies a route gated at "support", etc) instead of listing
// every allowed role explicitly.
const ROLE_RANK: Record<Role, number> = {
  user: 0,
  support: 1,
  admin: 2,
  super_admin: 3,
};

// Looks the role up fresh from db.users on every request rather than
// trusting a claim baked into the JWT at login time — a role change
// (promote/demote) takes effect immediately instead of only after the
// token is reissued.
export function requireRole(minRole: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userId = req.auth?.sub;
    const user = userId ? db.users.get(userId) : undefined;
    if (!user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    if (ROLE_RANK[user.role] < ROLE_RANK[minRole]) {
      return res.status(403).json({ error: "Insufficient role for this action" });
    }
    next();
  };
}
