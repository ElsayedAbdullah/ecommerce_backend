import { isValid } from "../../middleware/validation.js";

import { Router } from "express";
import { createCategorySchema } from "./category.validation.js";
import { createCategory } from "./category.controller.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { fileUpload, filterObject } from "../../utils/multer.js";

const categoryRouter = Router();

categoryRouter.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(filterObject.image).single("category"),
  isValid(createCategorySchema),
  createCategory
);

export default categoryRouter;
