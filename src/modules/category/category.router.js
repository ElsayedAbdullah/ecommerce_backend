import { isValid } from "../../middleware/validation.js";

import { Router } from "express";
import {
  createCategorySchema,
  deleteCategorySchema,
  updateCategorySchema,
} from "./category.validation.js";
import {
  createCategory,
  deleteCategory,
  updateCategory,
  allCategories,
} from "./category.controller.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { fileUpload, filterObject } from "../../utils/multer.js";
import subcategoryRouter from "../subcategory/subcategory.router.js";
import productRouter from "../product/product.router.js";

const categoryRouter = Router();

categoryRouter.use("/:categoryId/subcategory", subcategoryRouter);
categoryRouter.use("/:categoryId/products", productRouter);

// create category
categoryRouter.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(filterObject.image).single("category"),
  isValid(createCategorySchema),
  createCategory
);

// update category
categoryRouter.patch(
  "/:categoryId",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(filterObject.image).single("category"),
  isValid(updateCategorySchema),
  updateCategory
);

// delete category
categoryRouter.delete(
  "/:categoryId",
  isAuthenticated,
  isAuthorized("admin"),
  isValid(deleteCategorySchema),
  deleteCategory
);

// get Categories
categoryRouter.get("/", allCategories);

export default categoryRouter;
