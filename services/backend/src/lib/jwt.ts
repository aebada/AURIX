import jwt from "jsonwebtoken";

// Placeholder secret for local/dev use only — production must load this
// from a real secrets manager, never a committed default.
const JWT_SECRET = process.env.JWT_SECRET ?? "aurix-dev-secret-do-not-use-in-production";

export interface AuthTokenPayload {
  sub: string; // user id
  email: string;
}

export function signToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "12h" });
}

export function verifyToken(token: string): AuthTokenPayload {
  return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
}
