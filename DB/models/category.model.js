import mongoose, { Schema, Types, model } from "mongoose";

// Schema
const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  image: {
    url: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  createdBy: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Model

const Category = mongoose.models.Category || model("Category", categorySchema);

export default Category;
