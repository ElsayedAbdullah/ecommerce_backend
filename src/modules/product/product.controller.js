import { Product } from "../../../DB/models/product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { nanoid } from "nanoid";
import cloudinary from "../../utils/cloud.js";

// create product
export const createProduct = asyncHandler(async (req, res, next) => {
  // create unique cloud folder
  const cloudFolder = nanoid();
  let images = [];

  // check files
  if (!req.files) return next(new Error("product images not found"));

  // upload default image
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.files.defaultImage[0].path,
    { folder: `${process.env.FOLDER_CLOUD_NAME}/products/${cloudFolder}` }
  );

  // upload product images
  for (const file of req.files.productImages) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      file.path,
      { folder: `${process.env.FOLDER_CLOUD_NAME}/products/${cloudFolder}` }
    );
    images.push({ id: public_id, url: secure_url });
  }

  // create product
  const product = await Product.create({
    ...req.body,
    createdBy: req.user._id,
    cloudFolder,
    defaultImage: { id: public_id, url: secure_url },
    images,
  });

  // send response
  return res.status(201).json({ success: true, results: product });
});

// delete product
export const deleteProduct = asyncHandler(async (req, res, next) => {
  // check product
  const product = await Product.findById(req.params.productId);
  if (!product) return next(new Error("Product not found", { cause: 400 }));

  // check owner
  if (req.user._id.toString() !== product.createdBy.toString()) {
    return next(new Error("you are not allowed to delete"));
  }

  // delete product image in cloudinary
  const imagesArr = product.images;
  const ids = imagesArr.map((image) => image.id);
  ids.push(product.defaultImage.id); // add default image id to ids

  await cloudinary.api.delete_resources(ids);

  // delete the empty folder after deleting all product images
  await cloudinary.api.delete_folder(
    `${process.env.FOLDER_CLOUD_NAME}/products/${product.cloudFolder}`
  );

  // delete the product from database
  await Product.findByIdAndDelete(req.params.productId);

  // send response
  return res.json({
    success: true,
    message: "product deleted successfully!",
  });
});

// get all products
export const allProducts = asyncHandler(async (req, res, next) => {
  // all products
  // const products = await Product.find();

  // search by name
  // const searchedProducts = await Product.find({
  //   name: { $regex: req.query.name },
  // });

  // pagination
  const { page } = req.query;
  const limit = 2;
  const skip = limit * (page - 1);

  const paginatedProducts = await Product.find().skip(skip).limit(limit);

  // select
  const { fields } = req.query;
  // const selectedFields = await Product.find().select(fields);

  // sort
  const { sort } = req.query;
  // const sortedProducts = await Product.find().sort(sort);

  return res.json({ success: true, results: paginatedProducts });
});
