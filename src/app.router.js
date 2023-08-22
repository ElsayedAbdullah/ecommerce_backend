import connectDB from "../DB/connection.js";
import authRouter from "./modules/auth/auth.router.js";
import categoryRouter from "./modules/category/category.router.js";
import subcategoryRouter from "./modules/subcategory/subcategory.router.js";

const appRouter = (app, express) => {
  // Global middleware
  app.use(express.json());

  // Routes
  // auth
  app.use("/auth", authRouter);

  // category
  app.use("/category", categoryRouter);

  // subcategory
  app.use("/subcategory", subcategoryRouter);

  // not found page router
  app.all("*", (req, res, next) => {
    return next(new Error("Page not found"));
  });

  // global error handler
  app.use((error, req, res, next) => {
    return res
      .status(error.cause || 500)
      .json({ success: false, message: error.message, stack: error.stack });
  });

  connectDB();
};

export default appRouter;
