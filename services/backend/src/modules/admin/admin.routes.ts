import { Router } from "express";
import { z } from "zod";
import { db } from "../../data/mock-db.js";
import { requireAuth } from "../../middleware/require-auth.js";
import { ApiError } from "../../middleware/error-handler.js";

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

const kycDecisionSchema = z.object({
  decision: z.enum(["verified", "rejected"]),
});

adminRouter.post("/kyc/:userId/decision", requireAuth, (req, res, next) => {
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
