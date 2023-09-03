import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { isValid } from "../../middleware/validation.js";
import {
  createCouponSchema,
  deleteCouponSchema,
  updateCouponSchema,
} from "./coupon.validation.js";
import {
  allCoupons,
  createCoupon,
  deleteCoupon,
  updateCoupon,
} from "./coupon.controller.js";

const couponRouter = Router();

// CRUD
// create coupon
couponRouter.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  isValid(createCouponSchema),
  createCoupon
);

// update coupon
couponRouter.patch(
  "/:code",
  isAuthenticated,
  isAuthorized("admin"),
  isValid(updateCouponSchema),
  updateCoupon
);

// delete coupon
couponRouter.delete(
  "/:code",
  isAuthenticated,
  isAuthorized("admin"),
  isValid(deleteCouponSchema),
  deleteCoupon
);

// all coupon
couponRouter.get("/", allCoupons);

export default couponRouter;
