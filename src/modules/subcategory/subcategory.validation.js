import joi from "joi";
import { validObjectId } from "../../middleware/validation.js";

// create subcategorySchema
export const createSubcategorySchema = joi
  .object({
    name: joi.string().min(4).max(20).required(),
    categoryId: joi.string().custom(validObjectId).required(),
  })
  .required();

// update subcategorySchema
export const updateSubcategorySchema = joi
  .object({
    name: joi.string().min(4).max(20),
    categoryId: joi.string().custom(validObjectId).required(),
    subcategoryId: joi.string().custom(validObjectId).required(),
  })
  .required();

// delete subcategorySchema
export const deleteSubcategorySchema = joi
  .object({
    categoryId: joi.string().custom(validObjectId).required(),
    subcategoryId: joi.string().custom(validObjectId).required(),
  })
  .required();
