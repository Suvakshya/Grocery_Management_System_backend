import express from "express";
import { authSeller } from "../middlewares/authSeller.js";
import {
  getLowStockProducts,
  getStockStatistics,
  updateBulkStock,
  getStockAlerts
} from "../controller/stock.controller.js";

const router = express.Router();

// All routes require seller authentication
router.get("/low-stock", authSeller, getLowStockProducts);
router.get("/statistics", authSeller, getStockStatistics);
router.get("/alerts", authSeller, getStockAlerts);
router.post("/bulk-update", authSeller, updateBulkStock);

export default router;