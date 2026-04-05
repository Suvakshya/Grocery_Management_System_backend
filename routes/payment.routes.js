// routes/payment.routes.js
import express from "express";
import authUser from "../middlewares/authUser.js";
import { createPaypalOrder, capturePaypalPayment } from "../controller/payment.controller.js";

const router = express.Router();

router.post("/create-paypal-order", authUser, createPaypalOrder);
router.post("/capture-payment", authUser, capturePaypalPayment);

export default router;