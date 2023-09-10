import express from "express";
import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isValid } from "../../middleware/validation.js";
import { cancelOrderSchema, createOrderSchema } from "./order.validation.js";
import { cancelOrder, createOrder, orderWebhook } from "./order.controller.js";

const orderRouter = Router();

// create order
orderRouter.post("/", isAuthenticated, isValid(createOrderSchema), createOrder);

// cancel order
orderRouter.patch(
  "/:orderId",
  isAuthenticated,
  isValid(cancelOrderSchema),
  cancelOrder
);

// webhook
orderRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }, orderWebhook)
);

export default orderRouter;
