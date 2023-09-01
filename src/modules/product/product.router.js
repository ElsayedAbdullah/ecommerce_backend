import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { isValid } from "../../middleware/validation.js";
import { fileUpload, filterObject } from "../../utils/multer.js";
import {
  allProducts,
  createProduct,
  deleteProduct,
} from "./product.controller.js";
import { createProductSchema } from "./product.validation.js";

const productRouter = Router();

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
  deleteProduct
);

// get all products
productRouter.get("/", allProducts);

export default productRouter;
