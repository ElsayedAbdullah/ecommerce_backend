import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { isValid } from "../../middleware/validation.js";
import { fileUpload, filterObject } from "../../utils/multer.js";
import {
  allProducts,
  createProduct,
  deleteProduct,
  singleProduct,
} from "./product.controller.js";
import { ProductIdSchema, createProductSchema } from "./product.validation.js";

const productRouter = Router({ mergeParams: true });

// create product
productRouter.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(filterObject.image).fields([
    { name: "defaultImage", maxCount: 1 },
    { name: "productImages", maxCount: 3 },
  ]),
  isValid(createProductSchema),
  createProduct
);

// delete product
productRouter.delete(
  "/:productId",
  isAuthenticated,
  isAuthorized("admin"),
  isValid(ProductIdSchema),
  deleteProduct
);

// get all products
productRouter.get("/", allProducts);

// single product
productRouter.get(
  "/single/:productId",
  isValid(ProductIdSchema),
  singleProduct
);

export default productRouter;
