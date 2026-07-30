import { Router } from "express";
import { z } from "zod";
import { db } from "../../data/mock-db.js";
import { requireAuth } from "../../middleware/require-auth.js";
import { ApiError } from "../../middleware/error-handler.js";

export const usersRouter = Router();

usersRouter.get("/me", requireAuth, (req, res) => {
  const user = db.users.get(req.auth!.sub);
  if (!user) throw new ApiError(404, "User not found");
  res.json({
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    kycStatus: user.kycStatus,
    createdAt: user.createdAt,
    taxId: user.taxId ?? null,
  });
});

const taxIdSchema = z.object({ taxId: z.string().trim().min(1).max(64) });

// Deliberately separate from registration — the tax ID isn't needed to
// create an account, so we don't add friction to sign-up asking for it.
usersRouter.post("/me/tax-id", requireAuth, (req, res, next) => {
  try {
    const { taxId } = taxIdSchema.parse(req.body);
    const user = db.users.get(req.auth!.sub);
    if (!user) throw new ApiError(404, "User not found");

    user.taxId = taxId;
    db.users.set(user.id, user);
    res.json({ taxId: user.taxId });
  } catch (err) {
    next(err);
  }
});
