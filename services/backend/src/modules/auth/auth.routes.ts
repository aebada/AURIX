import { randomBytes } from "node:crypto";
import { Router } from "express";
import { OAuth2Client } from "google-auth-library";
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
    role: "user" as const,
  };
  db.users.set(id, user);
  db.usersByEmail.set(user.email, id);

  const token = signToken({ sub: id, email: user.email });
  res.status(201).json({
    token,
    user: { id, email: user.email, fullName, kycStatus: user.kycStatus, role: user.role },
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
      role: user.role,
    },
  });
});

// Client-side Google Identity Services flow: the frontend gets an ID
// token directly from Google and sends it here for verification against
// Google's public keys (via GOOGLE_CLIENT_ID as the expected audience).
// No client secret is ever needed or used for this flow.
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

const googleSchema = z.object({ idToken: z.string().min(1) });

authRouter.post("/google", async (req, res, next) => {
  try {
    if (!googleClient) {
      throw new ApiError(503, "Google sign-in is not configured (missing GOOGLE_CLIENT_ID)");
    }
    const { idToken } = googleSchema.parse(req.body);

    let email: string | undefined;
    let name: string | undefined;
    try {
      const ticket = await googleClient.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID });
      const payload = ticket.getPayload();
      email = payload?.email;
      name = payload?.name;
    } catch {
      throw new ApiError(401, "Invalid Google credential");
    }
    if (!email) {
      throw new ApiError(401, "Google account has no verified email");
    }

    const normalizedEmail = email.toLowerCase();
    let userId = db.usersByEmail.get(normalizedEmail);
    let user = userId ? db.users.get(userId) : undefined;

    if (!user) {
      userId = nextId("usr");
      user = {
        id: userId,
        email: normalizedEmail,
        // Google-authenticated accounts never log in with a password — this
        // is an unusable random placeholder, never sent to or known by the
        // user, just satisfying the User record shape.
        passwordHash: hashPassword(randomBytes(32).toString("hex")),
        fullName: name ?? normalizedEmail,
        createdAt: new Date().toISOString(),
        kycStatus: "unverified" as const,
        role: "user" as const,
      };
      db.users.set(userId, user);
      db.usersByEmail.set(normalizedEmail, userId);
    }

    const token = signToken({ sub: user.id, email: user.email });
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        kycStatus: user.kycStatus,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
});
