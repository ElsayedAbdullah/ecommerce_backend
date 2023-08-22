import joi from "joi";
import { isValidObjectId } from "mongoose";

// create category
export const createCategorySchema = joi
  .object({
    name: joi.string().required(),
    createdBy: joi.string().custom(isValidObjectId),
  })
  .required();

// update category
export const updateCategorySchema = joi
  .object({
    name: joi.string(),
    categoryId: joi.string().custom(isValidObjectId),
  })
  .required();

// delete category
export const deleteCategorySchema = joi
  .object({
    categoryId: joi.string().custom(isValidObjectId),
  })
  .required();
