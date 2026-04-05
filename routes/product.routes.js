// import express from "express";

// import { authSeller } from "../middlewares/authSeller.js";
// import {
//   addProduct,
//   changeStock,
//   getProductById,
//   getProducts,
// } from "../controller/product.controller.js";
// import { upload } from "../config/multer.js";
// const router = express.Router();

// router.post("/add-product", authSeller, upload.array("image", 4), addProduct);
// router.get("/list", getProducts);
// router.get("/id", getProductById);
// router.post("/stock", authSeller, changeStock);

// export default router;

import express from "express";
import { authSeller } from "../middlewares/authSeller.js";
import {
  addProduct,
  changeStock,
  getProductById,
  getProducts,
  updateStockQuantity,
  updateProduct ,
  deleteProduct// Added this import
} from "../controller/product.controller.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.post("/add-product", authSeller, upload.array("image", 4), addProduct);
router.get("/list", getProducts);
router.get("/:id", getProductById); // Changed to use params
router.post("/stock", authSeller, changeStock);
router.post("/stock-quantity", authSeller, updateStockQuantity); // Added this route
router.put("/update/:id", authSeller, upload.array("image", 4), updateProduct);
router.delete("/delete/:id", authSeller, deleteProduct);

export default router;