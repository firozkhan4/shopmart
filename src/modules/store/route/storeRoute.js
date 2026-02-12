import express from "express";
import storeController from "../controller/storeController.js";
import { authenticate } from "../../../middlewares/authMiddleware.js"

const router = express.Router();

router.post("/", authenticate, storeController.createStore);

router.get("/", storeController.getAllStores);

router.get("/:slug", storeController.getStoreBySlug);

router.put("/:id", authenticate, storeController.updateStore);

router.delete("/:id", authenticate, storeController.deleteStore);

export default router;
