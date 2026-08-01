import { Router } from "express";
import { z } from "zod";
import { db } from "../../data/mock-db.js";
import { requireAuth } from "../../middleware/require-auth.js";
import { requireRole } from "../../middleware/require-role.js";
import { ApiError } from "../../middleware/error-handler.js";

export const adminRouter = Router();

// RBAC: "support" is read-only (can view users/transactions/KYC queue but
// not act on them), "admin" can also make KYC decisions, "super_admin" can
// additionally change other users' roles (see /users/:userId/role below).
adminRouter.get("/users", requireAuth, requireRole("support"), (_req, res) => {
  const users = Array.from(db.users.values()).map((u) => ({
    id: u.id,
    email: u.email,
    fullName: u.fullName,
    kycStatus: u.kycStatus,
    role: u.role,
    createdAt: u.createdAt,
  }));
  res.json({ users });
});

adminRouter.get("/transactions", requireAuth, requireRole("support"), (_req, res) => {
  res.json({ transactions: db.transactions });
});

adminRouter.get("/kyc-queue", requireAuth, requireRole("support"), (_req, res) => {
  const pending = Array.from(db.users.values())
    .filter((u) => u.kycStatus === "pending")
    .map((u) => ({ id: u.id, email: u.email, fullName: u.fullName }));
  res.json({ pending });
});

const kycDecisionSchema = z.object({
  decision: z.enum(["verified", "rejected"]),
});

adminRouter.post("/kyc/:userId/decision", requireAuth, requireRole("admin"), (req, res, next) => {
  try {
    const { decision } = kycDecisionSchema.parse(req.body);
    const user = db.users.get(req.params.userId);
    if (!user) throw new ApiError(404, "User not found");

    user.kycStatus = decision;
    db.users.set(user.id, user);
    res.json({ id: user.id, kycStatus: user.kycStatus });
  } catch (err) {
    next(err);
  }
});

const roleSchema = z.object({ role: z.enum(["user", "support", "admin", "super_admin"]) });

adminRouter.post(
  "/users/:userId/role",
  requireAuth,
  requireRole("super_admin"),
  (req, res, next) => {
    try {
      const { role } = roleSchema.parse(req.body);
      const user = db.users.get(req.params.userId);
      if (!user) throw new ApiError(404, "User not found");

      user.role = role;
      db.users.set(user.id, user);
      res.json({ id: user.id, role: user.role });
    } catch (err) {
      next(err);
    }
  },
);
