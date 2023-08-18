export const isValid = (Schema) => {
  return (req, res, next) => {
    const reqValues = { ...req.query, ...req.body, ...req.params };
    const validationResult = Schema.validate(reqValues, { abortEarly: false });

    if (validationResult.error) {
      const messages = validationResult.error.details.map(
        (error) => error.message
      );

      return next(new Error(messages), { cause: 400 });
    }

    return next();
  };
};
