import { Coupon } from "../../../DB/models/coupon.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import voucher_codes from "voucher-code-generator";
// create coupon
export const createCoupon = asyncHandler(async (req, res, next) => {
  // generate name
  const code = voucher_codes.generate({
    length: 5,
  });

  // save coupon code in database
  const coupon = await Coupon.create({
    name: code[0],
    discount: req.body.discount,
    expiredAt: new Date(req.body.expiredAt).getTime(), //12/6/2023
    createdBy: req.user._id,
  });

  return res.status(201).json({ success: true, results: coupon });
});

// update coupon
export const updateCoupon = asyncHandler(async (req, res, next) => {
  // check if coupon
  const coupon = await Coupon.findOne({
    name: req.params.code,
    expiredAt: { $gt: Date.now() },
  });
  if (!coupon) return next(new Error("Invalid coupon code"));

  // check owner
  if (req.user._id.toString() !== coupon.createdBy.toString()) {
    return next(new Error("You are not the owner!", { cause: 404 }));
  }

  // update
  coupon.discount = req.body.discount ? req.body.discount : coupon.discount;
  coupon.expiredAt = req.body.expiredAt
    ? new Date(req.body.expiredAt).getTime()
    : coupon.expiredAt;

  coupon.save();

  return res.json({ success: true, message: "coupon updated successfully!" });
});

// delete coupon
export const deleteCoupon = asyncHandler(async (req, res, next) => {
  // check if coupon
  const coupon = await Coupon.findOne({
    name: req.params.code,
  });
  if (!coupon) return next(new Error("Invalid coupon code"));

  // check owner
  if (req.user._id.toString() !== coupon.createdBy.toString()) {
    return next(new Error("You are not the owner!", { cause: 404 }));
  }

  await Coupon.findOneAndDelete({ name: req.params.code });

  return res.json({ success: true, message: "coupon deleted successfully!" });
});

// allCoupons
export const allCoupons = asyncHandler(async (req, res, next) => {
  const coupons = await Coupon.find();
  return res.json({ success: true, results: coupons });
});
