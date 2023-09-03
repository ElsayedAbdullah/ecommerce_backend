import { Product } from "../../../DB/models/product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { nanoid } from "nanoid";
import cloudinary from "../../utils/cloud.js";
import Category from "../../../DB/models/category.model.js";
import { Subcategory } from "../../../DB/models/subcategory.model.js";
import Brand from "../../../DB/models/brand.model.js";

// create product
export const createProduct = asyncHandler(async (req, res, next) => {
  // check category
  const category = await Category.findById(req.body.category);
  if (!category) return next(new Error("Category not found", { cause: 404 }));

  // check subcategory
  const subcategory = await Subcategory.findById(req.body.subcategory);
  if (!subcategory)
    return next(new Error("Subcategory not found", { cause: 404 }));

  // check brand
  const brand = await Brand.findById(req.body.brand);
  if (!brand) return next(new Error("Brand not found", { cause: 404 }));

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
  if (req.params.categoryId) {
    // check category
    const category = await Category.findById(req.params.categoryId);
    if (!category) return next(new Error("Category not found"));

    const products = await Product.find({
      category: req.params.categoryId,
    });
    return res.json({ success: true, results: products });
  }
  // ********** get all products ********* \\
  // const products = await Product.find();

  // ********** Search ********* \\
  // to search in more than one field using $or operator and also make the search case insensitive with $options operator
  // let keyword = req.query.keyword;
  // keyword = !keyword ? "" : keyword;
  // console.log(keyword);
  // const products = await Product.find({
  //   $or: [
  //     { name: { $regex: keyword, $options: "i" } },
  //     { description: { $regex: keyword, $options: "i" } },
  //   ],
  // });

  // ********** Filter ********* \\
  // const products = await Product.find({ ...req.query });

  // ********** Pagination ********* \\
  // let { page } = req.query;
  // page = !page || page < 1 || isNaN(page) ? 1 : page;
  // const limit = 2;
  // const skip = limit * (page - 1);
  // const products = await Product.find().skip(skip).limit(limit);

  // ********** Sort ********* \\
  // const { sort } = req.query;
  // const products = await Product.find().sort(sort);

  // ********** Selection ********* \\
  // const { fields } = req.query;

  // // model keys
  // const modelKeys = Object.keys(Product.schema.paths);
  // console.log(modelKeys);

  // // query keys
  // const queryKeys = fields.split(" ");
  // console.log(queryKeys);

  // // matched keys
  // const matchedKeys = queryKeys.filter((key) => modelKeys.includes(key));
  // console.log(matchedKeys);

  const products = await Product.find({ ...req.query })
    .paginate(req.query.page)
    .customSelect(req.query.fields)
    .sort(req.query.sort);
  return res.json({ success: true, results: products });
});

// single product
export const singleProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);
  if (!product) return next(new Error("Product not found"));

  return res.json({ success: true, results: product });
});
