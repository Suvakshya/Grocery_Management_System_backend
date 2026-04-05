import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/connectDB.js";
dotenv.config();
import userRoutes from "./routes/user.routes.js";
import sellerRoutes from "./routes/seller.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import addressRoutes from "./routes/address.routes.js";
import orderRoutes from "./routes/order.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import adminUserRoutes from "./routes/adminUser.routes.js";
import stockRoutes from "./routes/stock.routes.js";
import recommendationRoutes from "./routes/recommendation.routes.js";

import { connectCloudinary } from "./config/cloudinary.js";


const app = express();

await connectCloudinary();
// allow multiple origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://grocery-management-system-frontend.vercel.app/"
];
//middlewares
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// Api endpoints
app.use("/images", express.static("uploads"));
app.use("/api/user", userRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/recommendations", recommendationRoutes);



// Add this to your main server file (app.js or server.js)
import paymentRoutes from './routes/payment.routes.js';
app.use('/api/payment', paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
