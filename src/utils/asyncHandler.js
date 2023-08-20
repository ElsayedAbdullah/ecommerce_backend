export const asyncHandler = (controller) => {
  return (req, res, next) => {
    controller(req, res, next).catch((err) => {
      return next(err);
    });
    return next();
  };
};
