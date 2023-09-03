import joi from "joi";

// create coupon schema
export const createCouponSchema = joi
  .object({
    discount: joi.number().min(1).max(100).required(),
    expiredAt: joi.date().greater(Date.now()).required(),
  })
  .required();

// update coupon Schema
export const updateCouponSchema = joi
  .object({
    code: joi.string().length(5).required(),
    discount: joi.number().min(1).max(100),
    expiredAt: joi.date().greater(Date.now()),
  })
  .required();

// delete coupon Schema
export const deleteCouponSchema = joi
  .object({
    code: joi.string().length(5).required(),
  })
  .required();
