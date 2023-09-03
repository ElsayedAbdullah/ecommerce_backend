import mongoose, { Schema, Types, model } from "mongoose";

// schema
const cartSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    products: [
      {
        _id: false,
        productId: {
          type: Types.ObjectId,
          ref: "Product",
          required: true,
          // unique: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

// model
export const Cart = mongoose.models.Cart || model("Cart", cartSchema);
