import { Router } from "express";
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
  });
});
