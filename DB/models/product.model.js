import mongoose, { Schema, Types, model } from "mongoose";

// schema
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    images: [
      {
        id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    defaultImage: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
    availableItems: {
      type: Number,
      min: 1,
      required: true,
    },
    soldItems: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      min: 1,
      required: true,
    },
    discount: {
      type: Number,
      min: 1,
      max: 100,
    },
    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
    brand: {
      type: Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    cloudFolder: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strictQuery: true,
  }
);

// virtuals
// to calculate the final price with info about price and discount
productSchema.virtual("finalPrice").get(function () {
  if (this.price) {
    return Number.parseFloat(
      this.price - (this.price * this.discount || 0) / 100
    ).toFixed(2);
  }
});

// Query helper
// pagination
productSchema.query.paginate = function (page) {
  page = !page || page < 1 || isNaN(page) ? 1 : page;
  const limit = 2;
  const skip = limit * (page - 1);
  return this.skip(skip).limit(limit);
};
// custom select
productSchema.query.customSelect = function (fields) {
  if (!fields) return this;
  // model keys
  const modelKeys = Object.keys(Product.schema.paths);
  // query keys
  const queryKeys = fields.split(" ");
  // matched keys
  const matchedKeys = queryKeys.filter((key) => modelKeys.includes(key));
  return this.select(matchedKeys);
};

// model
export const Product =
  mongoose.models.Product || model("Product", productSchema);
