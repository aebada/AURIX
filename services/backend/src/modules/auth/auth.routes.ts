import { Router } from "express";
import { z } from "zod";
import { db, nextId } from "../../data/mock-db.js";
import { hashPassword, verifyPassword } from "../../lib/password.js";
import { signToken } from "../../lib/jwt.js";
import { ApiError } from "../../middleware/error-handler.js";

export const authRouter = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(1),
});

// Mock only: real onboarding also runs KYC/AML checks (see
// modules/kyc) before a user can transact — not enforced here yet.
authRouter.post("/register", (req, res) => {
  const { email, password, fullName } = registerSchema.parse(req.body);

  if (db.usersByEmail.has(email.toLowerCase())) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const id = nextId("usr");
  const user = {
    id,
    email: email.toLowerCase(),
    passwordHash: hashPassword(password),
    fullName,
    createdAt: new Date().toISOString(),
    kycStatus: "unverified" as const,
  };
  db.users.set(id, user);
  db.usersByEmail.set(user.email, id);

  const token = signToken({ sub: id, email: user.email });
  res.status(201).json({
    token,
    user: { id, email: user.email, fullName, kycStatus: user.kycStatus },
  });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

authRouter.post("/login", (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const userId = db.usersByEmail.get(email.toLowerCase());
  const user = userId ? db.users.get(userId) : undefined;

  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signToken({ sub: user.id, email: user.email });
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      kycStatus: user.kycStatus,
    },
  });
});
