import express from "express";
import { authenticate } from "../../../middlewares/authMiddleware.js";
import productController from "../controller/productController.js"

const router = express.Router();

router.post("/", authenticate, productController.createProduct);

router.get("/", productController.getAllProducts);

router.get("/:id", productController.getProductById);

router.put("/:id", authenticate, productController.updateProduct);

router.delete("/:id", authenticate, productController.deleteProduct);

export default router;
