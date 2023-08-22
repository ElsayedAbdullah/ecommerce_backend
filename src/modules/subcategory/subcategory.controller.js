import slugify from "slugify";
import Category from "../../../DB/models/category.model.js";
import { Subcategory } from "../../../DB/models/subcategory.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";

// create subcategory
export const createSubcategory = asyncHandler(async (req, res, next) => {
  // data
  const { categoryId } = req.params;

  // check file
  if (!req.file) return next(new Error("Image is required", { cause: 400 }));

  // check category
  const category = await Category.findById(categoryId);
  if (!category) return next(new Error("Category not found", { cause: 404 }));

  // upload image
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.FOLDER_CLOUD_NAME}/subcategory` }
  );

  // save subcategory in db
  const subcategory = await Subcategory.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    image: {
      id: public_id,
      url: secure_url,
    },
    createdBy: req.user._id,
    categoryId,
  });

  // send response
  return res.json({ success: true, results: subcategory });
});
