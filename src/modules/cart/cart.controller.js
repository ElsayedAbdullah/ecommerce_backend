import { Cart } from "../../../DB/models/cart.model.js";
import { Product } from "../../../DB/models/product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// add to cart
export const addToCart = asyncHandler(async (req, res, next) => {
  // data {productId, quantity}
  const { productId, quantity } = req.body;

  // check product
  const product = await Product.findById(productId);
  if (!productId) return next(new Error("Product not found", { cause: 404 }));

  // check stock
  if (quantity > product.availableItems) {
    return next(
      new Error(
        `Sorry, only ${product.availableItems} items are left on the stock`
      )
    );
  }

  // another method to check stock
  // [inStock] is a method in product schema
  // if (!product.inStock(quantity)) {
  //   return next(
  //     new Error(
  //       `Sorry, only ${product.availableItems} items are left on the stock`
  //     )
  //   );
  // }

  // check if product is in cart
  const isProductInCart = await Cart.findOne({
    user: req.user._id,
    "products.productId": productId,
  });

  if (isProductInCart) {
    isProductInCart.products.forEach((prod) => {
      if (
        prod.productId.toString() === productId.toString() &&
        prod.quantity + quantity <= product.availableItems
      ) {
        prod.quantity += quantity;
      }
    });
    await isProductInCart.save();
    // send response
    return res.json({
      success: true,
      results: isProductInCart,
      message: "Product quantity updated successfully!",
    });
  } else {
    // add to cart
    // const cart = await Cart.findOne({ user: req.user._id });
    // cart.products.push({ productId, quantity });
    // await cart.save();

    // other method to add to cart
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $push: { products: { productId, quantity } } },
      { new: true }
    );

    // send response
    return res.json({
      success: true,
      results: cart,
      message: "Cart added successfully!",
    });
  }
});

// userCart
export const userCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.find({ user: req.user._id }).populate({
    path: "products.productId",
    select: "name price defaultImage.url",
  });
  return res.json({ success: true, results: cart });
});

// update product quantity in cart
export const updateCart = asyncHandler(async (req, res, next) => {
  // data {productId, quantity}
  const { productId, quantity } = req.body;

  // check product
  const product = await Product.findById(productId);
  if (!productId) return next(new Error("Product not found", { cause: 404 }));

  // check stock
  if (quantity > product.availableItems) {
    return next(
      new Error(`Sorry only ${product.availableItems} items are left`)
    );
  }

  // update product quantity
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id, "products.productId": productId },
    {
      $set: { "products.$.quantity": quantity },
    },
    {
      new: true,
    }
  );

  // send response
  return res.json({
    success: true,
    results: cart,
    message: "product quantity updated successfully",
  });
});

// remove product from cart
export const removeProductFromCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { products: { productId: req.params.productId } } },
    { new: true }
  );

  return res.json({
    success: true,
    results: cart,
    message: "Product removed successfully!",
  });
});

// clear Cart
export const clearCart = asyncHandler(async (req, res, next) => {
  // clear all products from cart after checking the cart
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { products: [] },
    { new: true }
  );

  // send response
  return res.json({
    success: true,
    results: cart,
    message: "Cart cleared successfully!",
  });
});
