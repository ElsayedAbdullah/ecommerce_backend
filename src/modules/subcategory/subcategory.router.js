import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { fileUpload, filterObject } from "../../utils/multer.js";
import { isValid } from "../../middleware/validation.js";
import { createSubcategorySchema } from "./subcategory.validation.js";
import { createSubcategory } from "./subcategory.controller.js";

const subcategoryRouter = Router({ mergeParams: true });

// CRUD
subcategoryRouter.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(filterObject.image).single("subcategory"),
  isValid(createSubcategorySchema),
  createSubcategory
);

export default subcategoryRouter;
