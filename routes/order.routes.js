// import express from "express";
// import authUser from "../middlewares/authUser.js";
// import {
//   getAllOrders,
//   getUserOrders,
//   placeOrderCOD,
// } from "../controller/order.controller.js";
// import { authSeller } from "../middlewares/authSeller.js";

// const router = express.Router();
// router.post("/cod", authUser, placeOrderCOD);
// router.get("/user", authUser, getUserOrders);
// router.get("/seller", authSeller, getAllOrders);

// export default router;





import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  getAllOrders,
  getUserOrders,
  placeOrderCOD,
  updateOrderPayment,
  updateOrderStatus
} from "../controller/order.controller.js";
import { authSeller } from "../middlewares/authSeller.js";

const router = express.Router();

// User routes
router.post("/cod", authUser, placeOrderCOD);
router.get("/user", authUser, getUserOrders);

// Seller routes
router.get("/seller", authSeller, getAllOrders);
router.post("/update-payment", authSeller, updateOrderPayment);
router.post("/update-status", authSeller, updateOrderStatus);

export default router;