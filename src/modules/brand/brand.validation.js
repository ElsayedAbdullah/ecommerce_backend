import joi from "joi";
import { validObjectId } from "../../middleware/validation.js";

// create brand
export const createBrandSchema = joi
  .object({
    name: joi.string().required(),
  })
  .required();

// update brand
export const updateBrandSchema = joi
  .object({
    name: joi.string(),
    brandId: joi.string().custom(validObjectId),
  })
  .required();

// delete brand
export const deleteBrandSchema = joi
  .object({
    brandId: joi.string().custom(validObjectId),
  })
  .required();
