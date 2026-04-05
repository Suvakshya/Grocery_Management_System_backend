import express from "express";
import { authSeller } from "../middlewares/authSeller.js";
import { getAnalytics } from "../controller/analytics.controller.js";

const router = express.Router();

router.get("/dashboard", authSeller, getAnalytics);

export default router;