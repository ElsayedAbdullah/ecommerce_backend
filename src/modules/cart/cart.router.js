import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isValid } from "../../middleware/validation.js";
import { cartSchema, removeProductFromCartSchema } from "./cart.validation.js";
import {
  addToCart,
  clearCart,
  removeProductFromCart,
  updateCart,
  userCart,
} from "./cart.controller.js";

const cartRouter = Router();

// add to cart
cartRouter.post("/", isAuthenticated, isValid(cartSchema), addToCart);

// user cart
cartRouter.get("/", isAuthenticated, userCart);

// update cart
cartRouter.patch("/", isAuthenticated, isValid(cartSchema), updateCart);

// clear cart
cartRouter.put("/clear", isAuthenticated, clearCart);

// remove product from cart
cartRouter.patch(
  "/:productId",
  isAuthenticated,
  isValid(removeProductFromCartSchema),
  removeProductFromCart
);
export default cartRouter;
