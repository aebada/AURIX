import { Router } from "express";
import { db } from "../../data/mock-db.js";
import { requireAuth } from "../../middleware/require-auth.js";
import { ApiError } from "../../middleware/error-handler.js";

export const kycRouter = Router();

// Mock KYC flow: real implementation orchestrates a licensed provider
// (SumSub / Onfido / Veriff / Persona — see docs/PRODUCT_PLAN.md 5.7)
// and reflects their verification result here, it never performs
// verification itself.
kycRouter.post("/submit", requireAuth, (req, res) => {
  const user = db.users.get(req.auth!.sub);
  if (!user) throw new ApiError(404, "User not found");

  user.kycStatus = "pending";
  db.users.set(user.id, user);

  // Simulate an async provider callback approving the user shortly after.
  setTimeout(() => {
    const current = db.users.get(user.id);
    if (current && current.kycStatus === "pending") {
      current.kycStatus = "verified";
      db.users.set(current.id, current);
    }
  }, 3000);

  res.status(202).json({ kycStatus: user.kycStatus });
});

kycRouter.get("/status", requireAuth, (req, res) => {
  const user = db.users.get(req.auth!.sub);
  if (!user) throw new ApiError(404, "User not found");
  res.json({ kycStatus: user.kycStatus });
});
