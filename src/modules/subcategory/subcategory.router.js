import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { fileUpload, filterObject } from "../../utils/multer.js";
import { isValid } from "../../middleware/validation.js";
import {
  createSubcategorySchema,
  deleteSubcategorySchema,
  updateSubcategorySchema,
} from "./subcategory.validation.js";
import {
  createSubcategory,
  deleteSubcategory,
  getAllSubcategories,
  updateSubcategory,
} from "./subcategory.controller.js";

const subcategoryRouter = Router({ mergeParams: true });

// CRUD
// create subcategory
subcategoryRouter.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(filterObject.image).single("subcategory"),
  isValid(createSubcategorySchema),
  createSubcategory
);

// update subcategory
subcategoryRouter.patch(
  "/:subcategoryId",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(filterObject.image).single("subcategory"),
  isValid(updateSubcategorySchema),
  updateSubcategory
);

// delete subcategory
subcategoryRouter.delete(
  "/:subcategoryId",
  isAuthenticated,
  isAuthorized("admin"),
  isValid(deleteSubcategorySchema),
  deleteSubcategory
);

// get all subcategories
subcategoryRouter.get("/", getAllSubcategories);

export default subcategoryRouter;
