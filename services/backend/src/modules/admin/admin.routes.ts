import { Router } from "express";
import { z } from "zod";
import { appendAuditLog, db } from "../../data/mock-db.js";
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

    const previous = user.kycStatus;
    user.kycStatus = decision;
    db.users.set(user.id, user);
    appendAuditLog({
      actorId: req.auth?.sub,
      action: "kyc.decision",
      targetType: "user",
      targetId: user.id,
      previousValue: previous,
      newValue: decision,
    });
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

      const previous = user.role;
      user.role = role;
      db.users.set(user.id, user);
      appendAuditLog({
        actorId: req.auth?.sub,
        action: "user.role",
        targetType: "user",
        targetId: user.id,
        previousValue: previous,
        newValue: role,
      });
      res.json({ id: user.id, role: user.role });
    } catch (err) {
      next(err);
    }
  },
);

adminRouter.get("/waitlist", requireAuth, requireRole("support"), (_req, res) => {
  res.json({ entries: db.waitlist });
});

adminRouter.get("/investors", requireAuth, requireRole("support"), (_req, res) => {
  res.json({ inquiries: db.investorInquiries });
});

const investorStatusSchema = z.object({
  status: z.enum(["new", "contacted", "in_diligence", "closed"]),
  notes: z.string().max(5000).optional(),
});

adminRouter.patch(
  "/investors/:id",
  requireAuth,
  requireRole("support"),
  (req, res, next) => {
    try {
      const body = investorStatusSchema.parse(req.body);
      const inquiry = db.investorInquiries.find((i) => i.id === req.params.id);
      if (!inquiry) throw new ApiError(404, "Inquiry not found");
      const previous = inquiry.status;
      inquiry.status = body.status;
      if (body.notes !== undefined) inquiry.notes = body.notes;
      inquiry.updatedAt = new Date().toISOString();
      appendAuditLog({
        actorId: req.auth?.sub,
        action: "investor.status",
        targetType: "InvestorInquiry",
        targetId: inquiry.id,
        previousValue: previous,
        newValue: body.status,
      });
      res.json({ inquiry });
    } catch (err) {
      next(err);
    }
  },
);

adminRouter.get("/feature-flags", requireAuth, requireRole("support"), (_req, res) => {
  res.json({ flags: db.featureFlags });
});

const flagsSchema = z.object({
  RESERVE_LIVE: z.boolean().optional(),
  MAINTENANCE_MODE: z.boolean().optional(),
  CROSS_BORDER_LIVE: z.record(z.boolean()).optional(),
  PAYROLL_BENEFIT_LIVE: z
    .object({ DE: z.boolean().optional(), AT: z.boolean().optional() })
    .optional(),
});

adminRouter.put(
  "/feature-flags",
  requireAuth,
  requireRole("super_admin"),
  (req, res, next) => {
    try {
      const body = flagsSchema.parse(req.body);
      const previous = JSON.stringify(db.featureFlags);
      if (body.RESERVE_LIVE !== undefined) db.featureFlags.RESERVE_LIVE = body.RESERVE_LIVE;
      if (body.MAINTENANCE_MODE !== undefined) {
        db.featureFlags.MAINTENANCE_MODE = body.MAINTENANCE_MODE;
      }
      if (body.CROSS_BORDER_LIVE) {
        db.featureFlags.CROSS_BORDER_LIVE = {
          ...db.featureFlags.CROSS_BORDER_LIVE,
          ...body.CROSS_BORDER_LIVE,
        };
      }
      if (body.PAYROLL_BENEFIT_LIVE) {
        db.featureFlags.PAYROLL_BENEFIT_LIVE = {
          ...db.featureFlags.PAYROLL_BENEFIT_LIVE,
          ...body.PAYROLL_BENEFIT_LIVE,
        };
      }
      appendAuditLog({
        actorId: req.auth?.sub,
        action: "feature_flags.update",
        targetType: "FeatureFlag",
        previousValue: previous,
        newValue: JSON.stringify(db.featureFlags),
      });
      res.json({ flags: db.featureFlags });
    } catch (err) {
      next(err);
    }
  },
);

adminRouter.get("/audit-logs", requireAuth, requireRole("admin"), (_req, res) => {
  res.json({ logs: db.adminAuditLogs.slice(0, 200) });
});
