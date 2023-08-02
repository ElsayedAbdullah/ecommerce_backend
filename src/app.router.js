import connectDB from "../DB/connection.js";
import authRouter from "./modules/user/user.router.js";

const appRouter = (app, express) => {
  // Global middleware
  app.use(express.json());

  // Routes
  app.use("/auth", authRouter);

  // not found page router
  app.use("*", (req, res, next) => {
    return next(new Error("Page not found", { cause: 404 }));
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
