import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isValid } from "../../middleware/validation.js";
import { cancelOrderSchema, createOrderSchema } from "./order.validation.js";
import { cancelOrder, createOrder } from "./order.controller.js";

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
export default orderRouter;
