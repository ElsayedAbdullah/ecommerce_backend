import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("DB connected successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};
export default connectDB;
