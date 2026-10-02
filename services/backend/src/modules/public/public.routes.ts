import { Router } from "express";
import { z } from "zod";
import {
  db,
  nextId,
  type InvestorInquiry,
  type PayrollEmployerApplication,
  type WaitlistEntry,
} from "../../data/mock-db.js";
import { ApiError } from "../../middleware/error-handler.js";

export const publicRouter = Router();

// Naive in-memory rate limit (IP → last submit ms). Fine for local/dev.
const lastSubmit = new Map<string, number>();
const RATE_MS = 15_000;

function clientIp(req: { ip?: string; headers: Record<string, unknown> }): string {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length) return fwd.split(",")[0]!.trim();
  return req.ip || "unknown";
}

function rateLimitOrThrow(req: { ip?: string; headers: Record<string, unknown> }) {
  const ip = clientIp(req);
  const last = lastSubmit.get(ip) ?? 0;
  if (Date.now() - last < RATE_MS) {
    throw new ApiError(429, "Too many submissions. Please wait a moment.");
  }
  lastSubmit.set(ip, Date.now());
}

function notifyAdminStub(channel: string, payload: unknown) {
  // Resend / Slack not configured yet — log for ops visibility.
  console.log(`[notify:${channel}]`, JSON.stringify(payload));
}

const waitlistSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  country: z.string().min(1).max(120),
  phone: z.string().max(40).optional(),
  interests: z.array(z.string().min(1)).min(1).max(20),
  referral: z.string().max(200).optional(),
  locale: z.string().max(16).optional(),
  // Honeypot — bots fill this; humans leave empty.
  website: z.string().optional(),
  turnstileToken: z.string().optional(),
});

publicRouter.post("/waitlist", (req, res, next) => {
  try {
    const body = waitlistSchema.parse(req.body);
    if (body.website && body.website.trim().length > 0) {
      // Silent success for bots
      return res.status(201).json({ ok: true });
    }
    if (db.featureFlags.MAINTENANCE_MODE) {
      throw new ApiError(503, "Maintenance mode — try again later.");
    }
    // Turnstile: only enforce when TURNSTILE_SECRET_KEY is set (env-gated).
    if (process.env.TURNSTILE_SECRET_KEY && !body.turnstileToken) {
      throw new ApiError(400, "Captcha required");
    }
    rateLimitOrThrow(req);

    const entry: WaitlistEntry = {
      id: nextId("wl"),
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      country: body.country.trim(),
      phone: body.phone?.trim() || undefined,
      interests: body.interests,
      referral: body.referral?.trim() || undefined,
      locale: body.locale,
      createdAt: new Date().toISOString(),
    };
    db.waitlist.unshift(entry);
    notifyAdminStub("waitlist", { id: entry.id, email: entry.email, country: entry.country });
    res.status(201).json({ ok: true, id: entry.id });
  } catch (err) {
    next(err);
  }
});

const investorSchema = z.object({
  name: z.string().min(1).max(200),
  firm: z.string().max(200).optional(),
  email: z.string().email().max(320),
  roleTitle: z.string().max(120).optional(),
  investorType: z.string().max(80).optional(),
  checkSize: z.string().max(80).optional(),
  interests: z.array(z.string()).max(20).optional(),
  message: z.string().min(1).max(5000),
  hearAbout: z.string().max(200).optional(),
  website: z.string().optional(),
  turnstileToken: z.string().optional(),
});

publicRouter.post("/investors", (req, res, next) => {
  try {
    const body = investorSchema.parse(req.body);
    if (body.website && body.website.trim().length > 0) {
      return res.status(201).json({ ok: true });
    }
    if (db.featureFlags.MAINTENANCE_MODE) {
      throw new ApiError(503, "Maintenance mode — try again later.");
    }
    if (process.env.TURNSTILE_SECRET_KEY && !body.turnstileToken) {
      throw new ApiError(400, "Captcha required");
    }
    rateLimitOrThrow(req);

    const now = new Date().toISOString();
    const inquiry: InvestorInquiry = {
      id: nextId("inv"),
      name: body.name.trim(),
      firm: body.firm?.trim() || undefined,
      email: body.email.trim().toLowerCase(),
      roleTitle: body.roleTitle?.trim() || undefined,
      investorType: body.investorType?.trim() || undefined,
      checkSize: body.checkSize?.trim() || undefined,
      interests: body.interests ?? [],
      message: body.message.trim(),
      hearAbout: body.hearAbout?.trim() || undefined,
      status: "new",
      createdAt: now,
      updatedAt: now,
    };
    db.investorInquiries.unshift(inquiry);
    notifyAdminStub("investor_inquiry", {
      id: inquiry.id,
      email: inquiry.email,
      firm: inquiry.firm,
    });
    res.status(201).json({ ok: true, id: inquiry.id });
  } catch (err) {
    next(err);
  }
});

const payrollEmployerSchema = z.object({
  companyLegalName: z.string().min(1).max(300),
  registrationNumber: z.string().min(1).max(120),
  country: z.enum(["DE", "AT"]),
  address: z.string().min(1).max(500),
  contactName: z.string().min(1).max(200),
  contactEmail: z.string().email().max(320),
  contactPhone: z.string().min(1).max(40),
  employeeCount: z.string().min(1).max(40),
  industry: z.string().max(120).optional(),
  additionalityAttested: z.literal(true),
  privacyConsent: z.literal(true),
  locale: z.string().max(16).optional(),
  website: z.string().optional(),
});

publicRouter.post("/payroll-employers", (req, res, next) => {
  try {
    const body = payrollEmployerSchema.parse(req.body);
    if (body.website && body.website.trim().length > 0) {
      return res.status(201).json({ ok: true });
    }
    if (db.featureFlags.MAINTENANCE_MODE) {
      throw new ApiError(503, "Maintenance mode — try again later.");
    }
    rateLimitOrThrow(req);

    const now = new Date().toISOString();
    const fwd = req.headers["x-forwarded-for"];
    const ip =
      typeof fwd === "string" && fwd.length
        ? fwd.split(",")[0]!.trim()
        : req.ip || undefined;

    const entry: PayrollEmployerApplication = {
      id: nextId("pe"),
      companyLegalName: body.companyLegalName.trim(),
      registrationNumber: body.registrationNumber.trim(),
      country: body.country,
      address: body.address.trim(),
      contactName: body.contactName.trim(),
      contactEmail: body.contactEmail.trim().toLowerCase(),
      contactPhone: body.contactPhone.trim(),
      employeeCount: body.employeeCount.trim(),
      industry: body.industry?.trim() || undefined,
      locale: body.locale,
      kybStatus: "pending",
      additionalityAttested: true,
      additionalityAttestedAt: now,
      additionalityAttestedBy: body.contactName.trim(),
      additionalityAttestedIp: ip,
      privacyConsent: true,
      createdAt: now,
      updatedAt: now,
    };
    db.payrollEmployers.unshift(entry);
    notifyAdminStub("payroll_employer", {
      id: entry.id,
      company: entry.companyLegalName,
      email: entry.contactEmail,
      country: entry.country,
    });
    res.status(201).json({ ok: true, id: entry.id, kybStatus: entry.kybStatus });
  } catch (err) {
    next(err);
  }
});

publicRouter.get("/feature-flags", (_req, res) => {
  res.json({ flags: db.featureFlags });
});
