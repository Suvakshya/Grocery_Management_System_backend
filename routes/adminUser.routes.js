import express from "express";
import { authSeller } from "../middlewares/authSeller.js";
import {
  getAllUsers,
  getUserDetails,
  deleteUser
} from "../controller/adminUser.controller.js";

const router = express.Router();

router.get("/all", authSeller, getAllUsers);
router.get("/details/:userId", authSeller, getUserDetails);
router.delete("/delete/:userId", authSeller, deleteUser);

export default router;