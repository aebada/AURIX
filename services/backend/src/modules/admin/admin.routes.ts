import { Router } from "express";
import { db } from "../../data/mock-db.js";
import { requireAuth } from "../../middleware/require-auth.js";

export const adminRouter = Router();

// No role-based access control yet — every route here must be gated to
// admin/ops users before this goes anywhere near production (see
// docs/PRODUCT_PLAN.md 3.4 and 5.8).
adminRouter.get("/users", requireAuth, (_req, res) => {
  const users = Array.from(db.users.values()).map((u) => ({
    id: u.id,
    email: u.email,
    fullName: u.fullName,
    kycStatus: u.kycStatus,
    createdAt: u.createdAt,
  }));
  res.json({ users });
});

adminRouter.get("/transactions", requireAuth, (_req, res) => {
  res.json({ transactions: db.transactions });
});

adminRouter.get("/kyc-queue", requireAuth, (_req, res) => {
  const pending = Array.from(db.users.values())
    .filter((u) => u.kycStatus === "pending")
    .map((u) => ({ id: u.id, email: u.email, fullName: u.fullName }));
  res.json({ pending });
});
