import { Router } from "express";
import { requireAuth } from "../../middleware/require-auth.js";

export const notificationsRouter = Router();

// Stub only — no real push/email/SMS provider wired up. In production
// this would be populated by wallet/payments/AI events (see
// docs/PRODUCT_PLAN.md "Notification service").
notificationsRouter.get("/", requireAuth, (_req, res) => {
  res.json({ notifications: [] });
});
