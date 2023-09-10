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
    invoice: {
      id: String,
      url: String,
    },
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
      type: String,
      enum: [
        "placed",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
        "paid",
        "failed pay",
      ],
      default: "placed",
    },
    payment: {
      type: String,
      enum: ["cash", "visa"],
      default: "cash",
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

// virtuals
// to calculate the final price with info about price and discount
orderSchema.virtual("finalPrice").get(function () {
  return this.coupon?.discount
    ? Number.parseFloat(
        this.price - (this.price * this.coupon.discount) / 100
      ).toFixed(2)
    : this.price;
});

export const Order = mongoose.models.Order || model("Order", orderSchema);
