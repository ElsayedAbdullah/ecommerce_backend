export const asyncHandler = (controller) => {
  return (req, res, next) => {
    controller(req, res, next).catch((err) => {
      return next(new Error(err));
    });
    // return next();
  };
};
