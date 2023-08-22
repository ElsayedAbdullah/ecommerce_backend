import Joi from "joi";
import { isValidObjectId } from "../../middleware/validation.js";

// create subcategorySchema
export const createSubcategorySchema = Joi.object({
  name: Joi.string().min(4).max(20).required(),
  categoryId: Joi.string().custom(isValidObjectId).required(),
}).required();

// update subcategorySchema
export const updateSubcategorySchema = Joi.object({
  name: Joi.string().min(4).max(20),
  categoryId: Joi.string().custom(isValidObjectId).required(),
  subcategoryId: Joi.string().custom(isValidObjectId).required(),
}).required();

// delete subcategorySchema
export const deleteSubcategorySchema = Joi.object({
  categoryId: Joi.string().custom(isValidObjectId).required(),
  subcategoryId: Joi.string().custom(isValidObjectId).required(),
}).required();
