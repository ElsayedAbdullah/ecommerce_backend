import { Types } from "mongoose";

export const validObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helper.message("Invalid ObjectId");
};

export const isValid = (Schema) => {
  return (req, res, next) => {
    const reqValues = { ...req.query, ...req.body, ...req.params };
    const validationResult = Schema.validate(reqValues, { abortEarly: false });

    if (validationResult.error) {
      const messages = validationResult.error.details.map(
        (error) => error.message
      );

      return next(new Error(messages));
    }

    return next();
  };
};
