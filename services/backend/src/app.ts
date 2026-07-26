import express from "express";
import cors from "cors";
import { authRouter } from "./modules/auth/auth.routes.js";
import { usersRouter } from "./modules/users/users.routes.js";
import { kycRouter } from "./modules/kyc/kyc.routes.js";
import { walletRouter } from "./modules/wallet/wallet.routes.js";
import { marketDataRouter } from "./modules/market-data/market-data.routes.js";
import { paymentsRouter } from "./modules/payments/payments.routes.js";
import { notificationsRouter } from "./modules/notifications/notifications.routes.js";
import { adminRouter } from "./modules/admin/admin.routes.js";
import { errorHandler } from "./middleware/error-handler.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "aurix-backend" });
  });

  app.use("/auth", authRouter);
  app.use("/users", usersRouter);
  app.use("/kyc", kycRouter);
  app.use("/wallet", walletRouter);
  app.use("/market-data", marketDataRouter);
  app.use("/payments", paymentsRouter);
  app.use("/notifications", notificationsRouter);
  app.use("/admin", adminRouter);

  app.use(errorHandler);

  return app;
}
