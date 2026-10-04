import { Router } from "express";
import { z } from "zod";
import {
  assertPracticeMintGated,
  createMetalOrder,
  db,
  updateMetalOrder,
  type MetalOrderStatus,
} from "../../data/mock-db.js";
import { requireAuth } from "../../middleware/require-auth.js";
import { requireRole } from "../../middleware/require-role.js";
import { ApiError } from "../../middleware/error-handler.js";
import { getCustodyProvider } from "../../providers/custody/index.js";
import { getPriceProvider, mockPriceProvider } from "../../providers/price/index.js";

export const metalOrdersRouter = Router();
export const ordersRouter = Router();

const GATE_NOTE =
  "Practice metal orders only. Live allocate/mint stays gated until signed London custody + RESERVE_LIVE.";

function orderPayload() {
  return {
    liveMint: false as const,
    reserveLive: db.featureFlags.RESERVE_LIVE,
    note: GATE_NOTE,
  };
}

metalOrdersRouter.get("/", requireAuth, requireRole("support"), (_req, res) => {
  res.json({
    ...orderPayload(),
    orders: db.metalOrders,
  });
});

metalOrdersRouter.get("/reserves", requireAuth, requireRole("support"), async (_req, res, next) => {
  try {
    const report = await getCustodyProvider().reportReserves();
    res.json({ report, reserveLive: db.featureFlags.RESERVE_LIVE, liveVault: false });
  } catch (err) {
    next(err);
  }
});

const createSchema = z
  .object({
    metal: z.enum(["gold", "silver"]).default("gold"),
    grams: z.number().positive().optional(),
    fiatAmount: z.number().positive().optional(),
    fiatCurrency: z.enum(["EUR", "USD"]).default("EUR"),
  })
  .refine((b) => (b.grams ?? 0) > 0 || (b.fiatAmount ?? 0) > 0, {
    message: "Provide grams or fiatAmount",
  });

ordersRouter.get("/", requireAuth, (req, res) => {
  const userId = req.auth!.sub;
  res.json({
    ...orderPayload(),
    orders: db.metalOrders.filter((o) => o.userId === userId),
  });
});

ordersRouter.post("/", requireAuth, async (req, res, next) => {
  try {
    const body = createSchema.parse(req.body);
    let quotes;
    let source = "mock";
    try {
      quotes = await getPriceProvider().getQuotes(body.fiatCurrency);
      source = getPriceProvider().id;
    } catch {
      quotes = await mockPriceProvider.getQuotes(body.fiatCurrency);
      source = mockPriceProvider.id;
    }
    const quote = quotes.find((q) => q.metal === body.metal);
    if (!quote) throw new ApiError(503, "Quote unavailable");

    let grams = body.grams ?? 0;
    let fiatAmount = body.fiatAmount ?? 0;
    if (body.grams && !body.fiatAmount) {
      fiatAmount = Number((body.grams * quote.pricePerGram).toFixed(2));
    } else if (body.fiatAmount && !body.grams) {
      grams = Number((body.fiatAmount / quote.pricePerGram).toFixed(4));
    } else if (body.grams && body.fiatAmount) {
      grams = body.grams;
      fiatAmount = body.fiatAmount;
    }

    const order = createMetalOrder({
      userId: req.auth!.sub,
      metal: body.metal,
      grams,
      fiatAmount,
      fiatCurrency: body.fiatCurrency,
      quoteId: `quote_${source}_${quote.kind}`,
    });

    res.status(201).json({
      ...orderPayload(),
      order,
      quote: { ...quote, liveCustody: false as const },
    });
  } catch (err) {
    next(err);
  }
});

function requireOwnOrder(userId: string, orderId: string) {
  const order = db.metalOrders.find((o) => o.id === orderId);
  if (!order) throw new ApiError(404, "Metal order not found");
  if (order.userId !== userId) throw new ApiError(403, "Not your order");
  return order;
}

ordersRouter.post("/:id/pay", requireAuth, (req, res, next) => {
  try {
    const order = requireOwnOrder(req.auth!.sub, req.params.id);
    if (order.status !== "quoted") {
      throw new ApiError(409, `Cannot pay from status ${order.status}`);
    }
    const nextOrder = updateMetalOrder(order.id, {
      status: "paid",
      note: "Practice paid mark — not a licensed PSP capture. Fiat on-ramp stays separate.",
    });
    res.json({ ...orderPayload(), order: nextOrder });
  } catch (err) {
    next(err);
  }
});

ordersRouter.post("/:id/allocate", requireAuth, async (req, res, next) => {
  try {
    const order = requireOwnOrder(req.auth!.sub, req.params.id);
    if (order.status !== "paid") {
      throw new ApiError(409, `Cannot allocate from status ${order.status}`);
    }
    const custody = getCustodyProvider();
    const pending = await custody.allocate(order.grams, order.metal);
    const confirmed = await custody.confirmAllocation(pending.id);
    const nextOrder = updateMetalOrder(order.id, {
      status: "allocated",
      custodyAllocationId: confirmed.id,
      note: "Practice allocation via mock CustodyProvider — not a London vault or allocated-platform fill.",
    });
    res.json({ ...orderPayload(), order: nextOrder, allocation: confirmed });
  } catch (err) {
    next(err);
  }
});

ordersRouter.post("/:id/mint", requireAuth, (req, res, next) => {
  try {
    requireOwnOrder(req.auth!.sub, req.params.id);
    try {
      assertPracticeMintGated("minted");
    } catch (e) {
      throw new ApiError(403, e instanceof Error ? e.message : "Mint gated");
    }
    throw new ApiError(403, "BPC mint is not implemented");
  } catch (err) {
    next(err);
  }
});

ordersRouter.post("/:id/cancel", requireAuth, (req, res, next) => {
  try {
    const order = requireOwnOrder(req.auth!.sub, req.params.id);
    const cancellable: MetalOrderStatus[] = ["quoted", "paid"];
    if (!cancellable.includes(order.status)) {
      throw new ApiError(409, `Cannot cancel from status ${order.status}`);
    }
    const nextOrder = updateMetalOrder(order.id, { status: "cancelled" });
    res.json({ ...orderPayload(), order: nextOrder });
  } catch (err) {
    next(err);
  }
});
