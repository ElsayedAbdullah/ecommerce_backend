import joi from "joi";
import { validObjectId } from "../../middleware/validation.js";

export const createOrderSchema = joi
  .object({
    address: joi.string().required(),
    coupon: joi.string().length(5),
    phone: joi
      .string()
      .regex(/^01[0-2,5]{1}[0-9]{8}$/)
      .required(),
    payment: joi.string().required(),
  })
  .required();

export const cancelOrderSchema = joi
  .object({
    orderId: joi.string().custom(validObjectId).required(),
  })
  .required();
