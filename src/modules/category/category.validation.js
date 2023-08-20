import joi from "joi";
import { Types } from "mongoose";

const isValidObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helper.message("Invalid ObjectId");
};

// create category
export const createCategorySchema = joi
  .object({
    name: joi.string().required(),
    createdBy: joi.string().custom(isValidObjectId),
  })
  .required();
