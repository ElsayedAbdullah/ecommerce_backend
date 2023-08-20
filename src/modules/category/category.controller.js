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
