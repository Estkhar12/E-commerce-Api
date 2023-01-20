import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.js";
import authRoute from "./routes/auth.js";
import productRoute from "./routes/product.js";
import cartRoute from "./routes/cart.js";
import orderRoute from "./routes/order.js";
import stripeRoute from "./routes/stripe.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/payment", stripeRoute);

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI);

app.listen(process.env.PORT || 5000, () => {
  console.log(" Server running on port 5000");
});
