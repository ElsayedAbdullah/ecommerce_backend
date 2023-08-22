import Joi from "joi";
import { isValidObjectId } from "../../middleware/validation.js";

// create subcategorySchema
export const createSubcategorySchema = Joi.object({
  name: Joi.string().min(4).max(5).required(),
  slug: Joi.string().required,
  image: Joi.string().required,
  categoryId: Joi.string().custom(isValidObjectId).required(),
}).required();
