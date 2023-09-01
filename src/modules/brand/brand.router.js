import { isValid } from "../../middleware/validation.js";

import { Router } from "express";
import {
  createBrandSchema,
  deleteBrandSchema,
  updateBrandSchema,
} from "./brand.validation.js";
import {
  createBrand,
  deleteBrand,
  updateBrand,
  allBrands,
} from "./brand.controller.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { fileUpload, filterObject } from "../../utils/multer.js";

const brandRouter = Router();

// create brand
brandRouter.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(filterObject.image).single("brand"),
  isValid(createBrandSchema),
  createBrand
);

// update brand
brandRouter.patch(
  "/:brandId",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(filterObject.image).single("brand"),
  isValid(updateBrandSchema),
  updateBrand
);

// delete brand
brandRouter.delete(
  "/:brandId",
  isAuthenticated,
  isAuthorized("admin"),
  isValid(deleteBrandSchema),
  deleteBrand
);

// get all Brands
brandRouter.get("/", allBrands);

export default brandRouter;
