import Category from "../../../DB/models/category.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import slugify from "slugify";
import cloudinary from "../../utils/cloud.js";

// CRUD

// Create category
export const createCategory = asyncHandler(async (req, res, next) => {
  // file
  if (!req.file) return next(new Error("Category image is required"));
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.FOLDER_CLOUD_NAME}/category` }
  );
  // save category in db
  const category = await Category.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    createdBy: req.user._id,
    image: {
      url: secure_url,
      id: public_id,
    },
  });

  // send response
  return res.status(201).json({ success: true, result: category });
});

// update category
export const updateCategory = asyncHandler(async (req, res, next) => {
  // check if category exists
  const category = await Category.findById(req.params.categoryId);
  if (!category) return next(new Error("Category not found"));

  // update name
  category.name = req.body.name ? req.body.name : category.name;

  // update slug
  category.slug = req.body.name ? slugify(req.body.name) : category.slug;

  // update image
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { public_id: category.image.id }
    );
    category.image.url = secure_url;
  }

  // save category
  await category.save();

  // send response
  return res.json({ success: true, result: category });
});

// delete Category
export const deleteCategory = asyncHandler(async (req, res, next) => {
  // check if category exists
  const category = await Category.findById(req.params.categoryId);
  if (!category) return next(new Error("Invalid category Id"));

  // remove the image of category from cloudinary
  const result = await cloudinary.uploader.destroy(category.image.id);

  // delete category from database
  await Category.findByIdAndDelete(req.params.categoryId);

  // send response
  return res.json({
    success: true,
    result: "Category is deleted successfully",
  });
});

// get all categories
export const allCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();
  return res.json({ success: true, result: categories });
});
