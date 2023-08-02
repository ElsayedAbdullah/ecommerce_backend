import userModel from "../../../DB/models/user.model.js";
import bcryptjs from "bcryptjs";

import crypto from "crypto";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { signupEmailTemp } from "../../utils/emailTemplate.js";

// register
export const register = asyncHandler(async (req, res, next) => {
  // data from request
  const { userName, email, password } = req.body;

  // check user existence
  const isUser = await userModel.findOne({ email });
  if (isUser) return next(new Error("Email already exists"), { cause: 409 });

  // hash password
  const hashPassword = bcryptjs.hashSync(
    password,
    Number(process.env.SALT_ROUND)
  );

  // generate activationCode
  const activationCode = crypto.randomBytes(64).toString("hex");

  // create user
  const user = await userModel.create({
    userName,
    email,
    password: hashPassword,
    activationCode,
  });

  // create confirmationLink
  const link = `http://localhost:3000/auth/confirmEmail/${activationCode}`;

  // send email
  const isSent = await sendEmail({
    to: email,
    subject: "Confirmation Email",
    html: signupEmailTemp(link),
  });

  // send response
  return isSent
    ? res.json({ success: true, message: "please review your email" })
    : next(new Error("something went wrong!"));
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  // find user, delete activationCode, update isConfirmed
  const activationCode = req.params.activationCode;
  const user = await userModel.findOneAndUpdate(
    { activationCode },
    { isConfirmed: true, $unset: { activationCode: 1 } }
  );

  // check if the user doesn't exist
  if (!user) return next(new Error("user not found!"), { cause: 404 });

  // create a cart

  // send response
  return res.json({
    success: true,
    message: "Congrats🎉 your email is already activated!",
  });
});
