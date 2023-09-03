import mongoose, { Schema, Types, model } from "mongoose";

const orderSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        _id: false,
        productId: { type: Types.ObjectId, ref: "Product" },
        quantity: { type: Number, min: 1 },
        name: String,
        itemPrice: Number,
        totalPrice: Number,
      },
    ],
    invoice: String,
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    coupon: {
      id: { type: Types.ObjectId, ref: "Coupon" },
      name: String,
      discount: {
        type: Number,
        min: 1,
        max: 100,
      },
    },
    status: {
      enum: ["placed", "shipped", "delivered", "cancelled", "refunded"],
      default: "placed",
    },
    payment: {
      type: String,
      enum: ["cash", "visa"],
      default: "cash",
    },
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || model("Order", orderSchema);
