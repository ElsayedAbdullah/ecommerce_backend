import joi from "joi";

// register
export const registerSchema = joi
  .object({
    userName: joi.string().alphanum().min(3).max(20).required(),
    email: joi.string().email().required(),
    password: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
  })
  .required();

// confirmEmail
export const confirmEmailSchema = joi
  .object({
    activationCode: joi.string().required(),
  })
  .required();

// loginSchema
export const loginSchema = joi
  .object({
    email: joi.string().email().required(),
    password: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  })
  .required();

// forgetCodeSchema
export const forgetCodeSchema = joi
  .object({
    email: joi.string().email().required(),
  })
  .required();

// resetPasswordSchema
export const resetPasswordSchema = joi
  .object({
    email: joi.string().email().required(),
    forgetCode: joi.string().required(),
    password: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
  })
  .required();
