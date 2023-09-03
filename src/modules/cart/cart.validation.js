import joi from "joi";
import { validObjectId } from "../../middleware/validation.js";

export const cartSchema = joi
  .object({
    productId: joi.string().custom(validObjectId).required(),
    quantity: joi.number().integer().min(1).required(),
  })
  .required();

export const removeProductFromCartSchema = joi
  .object({
    productId: joi.string().custom(validObjectId).required(),
  })
  .required();
