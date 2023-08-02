import { Router } from "express";
import { confirmEmail, register } from "./user.controller.js";
import { confirmEmailSchema, registerSchema } from "./user.validation.js";
import { isValid } from "../../middlewares/validation.js";

const authRouter = Router();

// register
authRouter.post("/register", isValid(registerSchema), register);

// confirmation email
authRouter.get(
  "/confirmEmail/:activationCode",
  isValid(confirmEmailSchema),
  confirmEmail
);

export default authRouter;
