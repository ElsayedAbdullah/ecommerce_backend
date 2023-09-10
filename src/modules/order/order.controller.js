import { Cart } from "../../../DB/models/cart.model.js";
import { Coupon } from "../../../DB/models/coupon.model.js";
import { Order } from "../../../DB/models/order.model.js";
import { Product } from "../../../DB/models/product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";
import { createInvoice } from "../../utils/createInvoice.js";
import fsExtra from "fs-extra";

// to the get the value of __dirname
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { sendEmail } from "../../utils/sendEmail.js";
import { clearCart, updateStock } from "./order.service.js";
import Stripe from "stripe";
import { nanoid } from "nanoid";
const __dirname = dirname(fileURLToPath(import.meta.url));

// create order
export const createOrder = asyncHandler(async (req, res, next) => {
  // check data
  const { payment, address, phone, coupon } = req.body;

  // check coupon
  let checkCoupon;
  if (coupon) {
    checkCoupon = await Coupon.findOne({
      name: coupon,
      expiredAt: { $gt: Date.now() },
    });

    if (!checkCoupon) return next(new Error("Invalid Coupon"));
  }

  // check if cart has products
  const cart = await Cart.findOne({ user: req.user._id });
  const products = cart.products;
  if (products.length < 1) return next(new Error("Cart is empty"));

  let orderProducts = [];
  let orderPrice = 0;
  // check products
  for (const prod of products) {
    // check product existence
    const product = await Product.findById(prod.productId);
    if (!product) return next(new Error(`Product ${prod.productId} not found`));

    // check product stock
    if (!product.inStock(prod.quantity))
      return next(
        new Error(
          `${product.name} out of stock, only ${product.availableItems} items are left`
        )
      );

    orderProducts.push({
      productId: product._id,
      quantity: prod.quantity,
      name: product.name,
      itemPrice: product.finalPrice,
      totalPrice: product.finalPrice * prod.quantity,
    });

    // calculate total price for all products
    orderPrice += product.finalPrice * prod.quantity;
  }

  // create order
  const order = await Order.create({
    user: req.user._id,
    products: orderProducts,
    address,
    phone,
    coupon: {
      id: checkCoupon?._id,
      name: checkCoupon?.name,
      discount: checkCoupon?.discount,
    },
    payment,
    price: orderPrice,
  });

  // generate invoice
  const user = req.user;
  const invoice = {
    shipping: {
      name: user.userName,
      address: order.address,
      country: "Egypt",
    },
    items: order.products,
    subtotal: order.price,
    paid: order.finalPrice,
    invoice_nr: order._id,
  };

  const pdfPath = path.join(
    __dirname,
    `./../../../invoiceTemp/${order._id}.pdf`
  );

  createInvoice(invoice, pdfPath);

  // upload invoice to cloudinary
  // const { secure_url, public_id } = await cloudinary.uploader.upload(pdfPath, {
  //   folder: `${process.env.FOLDER_CLOUD_NAME}/order/invoice/${user._id}`,
  // });

  // // add invoice to order
  order.invoice = { id: nanoid(), url: pdfPath }; // local
  // order.invoice = { id: public_id, url: secure_url }; // cloudinary
  await order.save();

  // send email
  const isSent = await sendEmail({
    to: user.email,
    subject: "Order Invoice",
    attachments: [
      {
        path: pdfPath, // local
        // path: secure_url, // cloudinary
        contentType: "application/pdf",
      },
    ],
  });

  if (isSent) {
    // update stock
    updateStock(order.products, true);
    // clear cart
    clearCart(user._id);
  }

  // TODO delete files from invoiceTemp using file system
  // let dir = "./invoiceTemp";
  // await fsExtra.emptyDir(dir);

  // Stripe Payment
  if (payment === "visa") {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    let existCoupon;
    if (order.coupon.name !== undefined) {
      existCoupon = await stripe.coupons.create({
        percent_off: order.coupon.discount,
        duration: "once",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      metadata: { order_id: order._id.toString() },
      success_url: process.env.SUCCESS_URL,
      cancel_url: process.env.CANCEL_URL,
      line_items: order.products.map((product) => {
        return {
          price_data: {
            currency: "egp",
            product_data: {
              name: product.name,
              // images: [product.productId.defaultImage.url]
            },
            unit_amount: product.itemPrice * 100,
          },
          quantity: product.quantity,
        };
      }),
      // discounts: existCoupon ? [{ coupon: existCoupon.id }] : [],
      ...(existCoupon ? [{ discounts: [{ coupon: existCoupon.id }] }] : []), // to put the discounts only if there is existCoupon
    });

    return res.json({ success: true, results: session.url });
  }

  // send response
  return res.json({
    success: true,
    message: "Order Placed successfully, please check your email!",
  });
});

// cancel order
export const cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) return next(new Error("Order not found", { cause: 404 }));

  if (order.status === "shipped" || order.status === "delivered") {
    return next(new Error("Order cannot be canceled"));
  }

  order.status = "cancelled";
  order.save();

  updateStock(order.products);

  return res.json({ success: true, message: "Order cancelled successfully" });
});

// stipe webhook
export const orderWebhook = asyncHandler(async (request, response) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = request.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.ENDPOINT_SECRET
    );
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  const orderId = event.data.object.metadata.order_id;
  console.log(orderId);
  if (event.type === "checkout.session.completed") {
    // change order status
    await Order.findOneAndUpdate({ _id: orderId }, { status: "Paid" });
    return;
  }
  await Order.findOneAndUpdate({ _id: orderId }, { status: "Failed to pay" });
  return;
});
