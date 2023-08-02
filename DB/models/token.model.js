import mongoose, { Schema, model } from "mongoose";

// Schema
const tokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    agent: String,
    expiredAt: String,
  },
  { timestamps: true }
);

// Model
const tokenModel = mongoose.models.tokenModel || model("Token", tokenSchema);
export default tokenModel;
