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
    },
    subcategory: {
      type: Types.ObjectId,
      ref: "Subcategory",
    },
    brand: {
      type: Types.ObjectId,
      ref: "Brand",
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
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// to calculate the final price with info about price and discount
productSchema.virtual("finalPrice").get(function () {
  if (this.price) {
    return Number.parseFloat(
      this.price - (this.price * this.discount || 0) / 100
    ).toFixed(2);
  }
});

// model
export const Product =
  mongoose.models.Product || model("Product", productSchema);
