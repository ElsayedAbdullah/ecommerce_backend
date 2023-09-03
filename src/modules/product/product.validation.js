import joi from "joi";
import { validObjectId } from "../../middleware/validation.js";

export const createProductSchema = joi
  .object({
    name: joi.string().required(),
    description: joi.string(),
    availableItems: joi.number().min(1).required(),
    price: joi.number().min(1).required(),
    discount: joi.number().min(1).max(100),
    category: joi.string().custom(validObjectId).required(),
    subcategory: joi.string().custom(validObjectId).required(),
    brand: joi.string().custom(validObjectId).required(),
  })
  .required();

export const ProductIdSchema = joi
  .object({
    productId: joi.string().custom(validObjectId).required(),
  })
  .required();
