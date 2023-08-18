import connectDB from "../DB/connection.js";
import authRouter from "./modules/auth/auth.router.js";

const appRouter = (app, express) => {
  // Global middleware
  app.use(express.json());

  // Routes
  // auth
  app.use("/auth", authRouter);

  // not found page router
  app.all("*", (req, res, next) => {
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
