import Brand from "../../../DB/models/brand.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import slugify from "slugify";
import cloudinary from "../../utils/cloud.js";
import Category from "../../../DB/models/category.model.js";

// CRUD

// Create brand
export const createBrand = asyncHandler(async (req, res, next) => {
  // check category
  const category = await Category.findById(req.body.categoryId);
  if (!category) return next(new Error("Category not found", { cause: 404 }));

  // file
  if (!req.file) return next(new Error("Brand image is required"));
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.FOLDER_CLOUD_NAME}/brand` }
  );
  // save brand in db
  const brand = await Brand.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    createdBy: req.user._id,
    category: req.body.categoryId,
    image: {
      url: secure_url,
      id: public_id,
    },
  });

  // send response
  return res.status(201).json({ success: true, result: brand });
});

// update brand
export const updateBrand = asyncHandler(async (req, res, next) => {
  // check if brand exists
  const brand = await Brand.findById(req.params.brandId);
  if (!brand) return next(new Error("Brand not found"));

  // check owner
  if (req.user._id.toString() !== brand.createdBy.toString()) {
    return next(new Error("You are not the owner!", { cause: 404 }));
  }

  // update name
  brand.name = req.body.name ? req.body.name : brand.name;

  // update slug
  brand.slug = req.body.name ? slugify(req.body.name) : brand.slug;

  // update image
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { public_id: brand.image.id }
    );
    brand.image.url = secure_url;
  }

  // save brand
  await brand.save();

  // send response
  return res.json({
    success: true,
    message: "Brand updated successfully",
    result: brand,
  });
});

// delete Brand
export const deleteBrand = asyncHandler(async (req, res, next) => {
  // check if brand exists
  const brand = await Brand.findById(req.params.brandId);
  if (!brand) return next(new Error("Invalid brand Id"));

  // check owner
  if (req.user._id.toString() !== brand.createdBy.toString()) {
    return next(new Error("You are not the owner!", { cause: 404 }));
  }

  // remove the image of brand from cloudinary
  const result = await cloudinary.uploader.destroy(brand.image.id);

  // delete brand from database
  await Brand.findByIdAndDelete(req.params.brandId);

  // send response
  return res.json({
    success: true,
    message: "Brand deleted successfully",
  });
});

// get all categories
export const allBrands = asyncHandler(async (req, res, next) => {
  const brands = await Brand.find();
  return res.json({ success: true, result: brands });
});
