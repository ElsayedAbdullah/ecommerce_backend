import User from "../../DB/models/user.model.js";
import Token from "../../DB/models/token.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  // check token existence and type
  let token = req.headers["token"];
  if (!token || !token.startsWith(process.env.BEARER_KEY)) {
    return next(new Error("Valid Token is required"));
  }

  // check payload [split - verify]
  token = token.split(process.env.BEARER_KEY)[1];
  const decoded = jwt.verify(token, process.env.TOKEN_KEY);
  if (!decoded) return next(new Error("Invalid Token"));

  // check token in DB
  const tokenDB = await Token.findOne({ token, isValid: true });
  if (!tokenDB) return next(new Error("Token is expired"));

  // check user existence
  const user = await User.findOne({ email: decoded.email });
  if (!user) return next(new Error("User not found"));

  // pass user
  req.user = user;

  // return next
  return next();
});
