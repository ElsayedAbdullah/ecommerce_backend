import bcryptjs from "bcryptjs";

import crypto from "crypto";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { signupEmailTemp } from "../../utils/emailTemplate.js";
import User from "../../../DB/models/user.model.js";
import Token from "../../../DB/models/token.model.js";

// Register
export const register = asyncHandler(async (req, res, next) => {
  // data from request
  const { userName, email, password } = req.body;

  // check user existence
  const isUser = await User.findOne({ email });
  if (isUser) return next(new Error("Email already exists"), { cause: 409 });

  // hash password
  const hashPassword = bcryptjs.hashSync(
    password,
    Number(process.env.SALT_ROUND)
  );

  // generate activationCode
  const activationCode = crypto.randomBytes(64).toString("hex");

  // create user
  const user = await User.create({
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

// confirm Email
export const confirmEmail = asyncHandler(async (req, res, next) => {
  // find user, delete activationCode, update isConfirmed
  const activationCode = req.params.activationCode;
  const user = await User.findOneAndUpdate(
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

// Login
export const login = asyncHandler(async (req, res, next) => {
  // data from request
  const { email, password } = req.body;
  // check user existence

  const user = await User.findOne({ email });
  if (!user) return next(new Error("Invalid Email"));

  // check is confirmed
  if (!user.isConfirmed) return next(new Error("inactivated account"));

  // check password
  const match = bcryptjs.compareSync(password, user.password);
  if (!match) return next(new Error("Invalid Password"));

  // generate Token
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.TOKEN_KEY,
    {
      expiresIn: "2d",
    }
  );

  //save token in token model
  await Token.create({
    token,
    user: user._id,
    agent: req.headers["user-agent"],
  });

  // change user status to online and save user
  user.status = "online";
  await user.save();

  // send response

  return res.json({ success: true, result: token });
});

// forgetPasswordCode
export const forgetCode = asyncHandler(async (req, res, next) => {
  //  check user
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new Error("Invalid Email"));

  // generate code
  const code = randomstring.generate({
    length: 5,
    charset: "numeric",
  });

  // save code in db
  user.forgetCode = code;
  await user.save();

  // send Email

  const isSent = sendEmail({
    to: user.email,
    subject: "Reset Password",
    html: resetPasswordTemp(code),
  });

  return isSent
    ? res.json({ success: true, message: "Check your email" })
    : next(new Error("Something went wrong!"));
});

// Reset Password
export const resetPassword = asyncHandler(async (req, res, next) => {
  // check user
  let user = await User.findOne({ email: req.body.email });
  if (!user) return next(new Error("Invalid Email"));

  // check forgetCode
  if (user.forgetCode !== req.body.forgetCode)
    return next(new Error("Invalid Forget Code!"));

  // remove forgetCode
  user = await User.findOneAndUpdate(
    { email: user.email },
    { $unset: { forgetCode: 1 } }
  );

  // hash password and save it in db
  const hashedPassword = bcryptjs.hashSync(
    req.body.password,
    Number(process.env.SALT_ROUND)
  );
  user.password = hashedPassword;

  await user.save();

  // invalidate all tokens
  const tokens = await Token.find({ user: user._id });
  tokens.forEach(async (token) => {
    token.isValid = false;
    await token.save();
  });

  // send response
  return res.json({ success: true, message: "Try to login now!" });
});
