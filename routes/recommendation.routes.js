// // routes/recommendation.routes.js
// import express from "express";
// import { 
//   getRecommendations, 
//   getMultiTypeRecommendations,
//   getHomepageRecommendations 
// } from "../controller/recommendation.controller.js";
// import authUser from "../middlewares/authUser.js";

// const router = express.Router();

// // Single endpoint for all recommendation types
// // GET /api/recommendations?type=new-arrivals&limit=10
// // GET /api/recommendations?type=popular&limit=5
// // GET /api/recommendations?type=personalized&limit=8
// // GET /api/recommendations?type=frequently-bought&productId=123&limit=4
// // GET /api/recommendations?type=similar&productId=123&limit=6
// // GET /api/recommendations?type=category&category=electronics&limit=8
// // GET /api/recommendations?type=price-range&minPrice=10&maxPrice=50&limit=10
// router.get("/", authUser, getRecommendations);

// // Get multiple recommendation types in one request
// // GET /api/recommendations/multi?types=new-arrivals,popular,trending&limit=5
// router.get("/multi", authUser, getMultiTypeRecommendations);

// // Get optimized homepage recommendations
// // GET /api/recommendations/homepage
// router.get("/homepage", authUser, getHomepageRecommendations);

// export default router;












// routes/recommendation.routes.js
import express from "express";
import { getMultiTypeRecommendations } from "../controller/recommendation.controller.js";

const router = express.Router();

router.get("/multi",getMultiTypeRecommendations);

export default router;