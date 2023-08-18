import { Router } from "express";
import {
  confirmEmail,
  forgetCode,
  login,
  register,
  resetPassword,
} from "./auth.controller.js";
import {
  confirmEmailSchema,
  forgetCodeSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "./auth.validation.js";
import { isValid } from "../../middleware/validation.js";

const authRouter = Router();

// register
authRouter.post("/register", isValid(registerSchema), register);

// confirmation email
authRouter.get(
  "/confirmEmail/:activationCode",
  isValid(confirmEmailSchema),
  confirmEmail
);

// login
authRouter.post("/login", isValid(loginSchema), login);

// forgetPasswordCode
authRouter.patch("/forgetCode", isValid(forgetCodeSchema), forgetCode);

// reset password
authRouter.patch("/resetPassword", isValid(resetPasswordSchema), resetPassword);

export default authRouter;
