import express from "express";
import config from "./config.js";
import cors from "cors"

import { connectDB } from "./database/index.js";

import userRoutes from "./modules/user/route/userRoute.js";
import authRoutes from "./modules/auth/route/authRoute.js"
import storeRoutes from "./modules/store/route/storeRoute.js"
import productRoutes from "./modules/product/route/productRoute.js"

const PORT = config.PORT || 3000;

const app = express();

/**
 * Middlewares
 */

app.use(cors({
  origin: config.ALLOWED_URL.split(",")
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/**
 * Health Check
 */
app.get("/", (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "API is running",
  });
});

/**
 * Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/products", productRoutes)

/**
 * Global Error Handler (Optional but Recommended)
 */
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

/**
 * Start Server After DB Connection
 */
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Startup failed:", error);
    process.exit(1);
  }
};

startServer();
