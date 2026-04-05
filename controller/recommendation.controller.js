// // controller/recommendation.controller.js
// import Product from "../models/product.model.js";
// import Order from "../models/order.model.js";
// import User from "../models/user.model.js";

// // ============================================
// // ALGORITHM 1: New Arrivals / Recently Added
// // ============================================
// const getNewArrivals = async (limit = 10) => {
//   // Get products sorted by creation date (newest first)
//   const newProducts = await Product.find({ inStock: true })
//     .sort({ createdAt: -1 })
//     .limit(limit);
  
//   return newProducts;
// };

// // ============================================
// // ALGORITHM 2: Popular Products (Based on Order Frequency)
// // ============================================
// const getPopularProducts = async (limit = 10) => {
//   // Aggregate orders to find most frequently ordered products
//   const popularProducts = await Order.aggregate([
//     { $match: { status: { $ne: "Cancelled" } } }, // Exclude cancelled orders
//     { $unwind: "$items" },
//     { 
//       $group: {
//         _id: "$items.product",
//         orderCount: { $sum: 1 },
//         totalQuantity: { $sum: "$items.quantity" }
//       }
//     },
//     { $sort: { orderCount: -1, totalQuantity: -1 } },
//     { $limit: limit }
//   ]);

//   // Get full product details
//   const productIds = popularProducts.map(p => p._id);
//   const products = await Product.find({ 
//     _id: { $in: productIds },
//     inStock: true 
//   });

//   // Maintain the order from aggregation
//   const orderedProducts = productIds.map(id => 
//     products.find(p => p._id.toString() === id.toString())
//   ).filter(p => p); // Remove any null values

//   return orderedProducts;
// };

// // ============================================
// // ALGORITHM 3: Top Rated / Best Selling (Based on Revenue)
// // ============================================
// const getBestSelling = async (limit = 10) => {
//   // Aggregate orders to find products generating most revenue
//   const bestSelling = await Order.aggregate([
//     { $match: { status: { $ne: "Cancelled" }, isPaid: true } },
//     { $unwind: "$items" },
//     {
//       $lookup: {
//         from: "products",
//         localField: "items.product",
//         foreignField: "_id",
//         as: "productDetails"
//       }
//     },
//     { $unwind: "$productDetails" },
//     {
//       $group: {
//         _id: "$items.product",
//         totalRevenue: { 
//           $sum: { 
//             $multiply: ["$productDetails.offerPrice", "$items.quantity"] 
//           } 
//         },
//         totalQuantity: { $sum: "$items.quantity" },
//         orderCount: { $sum: 1 }
//       }
//     },
//     { $sort: { totalRevenue: -1 } },
//     { $limit: limit }
//   ]);

//   const productIds = bestSelling.map(p => p._id);
//   const products = await Product.find({ 
//     _id: { $in: productIds },
//     inStock: true 
//   });

//   const orderedProducts = productIds.map(id => 
//     products.find(p => p._id.toString() === id.toString())
//   ).filter(p => p);

//   return orderedProducts;
// };

// // ============================================
// // ALGORITHM 4: Frequently Bought Together (Market Basket Analysis)
// // ============================================
// const getFrequentlyBoughtTogether = async (productId, limit = 5) => {
//   // Find orders that contain the specified product
//   const ordersWithProduct = await Order.find({
//     "items.product": productId,
//     status: { $ne: "Cancelled" }
//   }).select("items");

//   if (ordersWithProduct.length === 0) {
//     return [];
//   }

//   // Find all products that appear in the same orders
//   const productFrequency = {};
//   const orderCount = ordersWithProduct.length;

//   ordersWithProduct.forEach(order => {
//     order.items.forEach(item => {
//       const id = item.product.toString();
//       if (id !== productId.toString()) {
//         productFrequency[id] = (productFrequency[id] || 0) + 1;
//       }
//     });
//   });

//   // Calculate confidence and sort
//   const recommendations = Object.entries(productFrequency)
//     .map(([id, frequency]) => ({
//       productId: id,
//       frequency,
//       confidence: frequency / orderCount
//     }))
//     .sort((a, b) => b.confidence - a.confidence)
//     .slice(0, limit);

//   // Get product details
//   const productIds = recommendations.map(r => r.productId);
//   const products = await Product.find({ 
//     _id: { $in: productIds },
//     inStock: true 
//   });

//   // Add confidence scores to products
//   const productsWithScores = products.map(product => {
//     const rec = recommendations.find(
//       r => r.productId === product._id.toString()
//     );
//     return {
//       ...product.toObject(),
//       recommendationScore: rec.confidence
//     };
//   });

//   return productsWithScores;
// };

// // ============================================
// // ALGORITHM 5: Personalized Recommendations (Collaborative Filtering)
// // ============================================
// const getPersonalizedRecommendations = async (userId, limit = 10) => {
//   if (!userId) {
//     // If no user, return popular products
//     return getPopularProducts(limit);
//   }

//   // Get user's order history
//   const userOrders = await Order.find({ 
//     userId, 
//     status: { $ne: "Cancelled" } 
//   }).populate("items.product");

//   if (userOrders.length === 0) {
//     // If user has no orders, return popular products
//     return getPopularProducts(limit);
//   }

//   // Extract user's preferred categories and products
//   const userPreferences = {
//     categories: {},
//     products: new Set()
//   };

//   userOrders.forEach(order => {
//     order.items.forEach(item => {
//       if (item.product) {
//         userPreferences.products.add(item.product._id.toString());
//         if (item.product.category) {
//           userPreferences.categories[item.product.category] = 
//             (userPreferences.categories[item.product.category] || 0) + 1;
//         }
//       }
//     });
//   });

//   // Find users with similar purchase patterns
//   const userProductList = Array.from(userPreferences.products);
  
//   // Find other users who bought similar products
//   const similarUsers = await Order.aggregate([
//     { $match: { 
//       userId: { $ne: userId },
//       status: { $ne: "Cancelled" }
//     }},
//     { $unwind: "$items" },
//     { $match: { "items.product": { $in: userProductList } } },
//     { $group: {
//       _id: "$userId",
//       commonProducts: { $addToSet: "$items.product" },
//       matchCount: { $sum: 1 }
//     }},
//     { $sort: { matchCount: -1 } },
//     { $limit: 20 }
//   ]);

//   const similarUserIds = similarUsers.map(u => u._id);

//   // Get products bought by similar users
//   const recommendedProducts = await Order.aggregate([
//     { $match: { 
//       userId: { $in: similarUserIds },
//       status: { $ne: "Cancelled" }
//     }},
//     { $unwind: "$items" },
//     { $match: { 
//       "items.product": { $nin: userProductList } // Exclude products user already bought
//     }},
//     { $group: {
//       _id: "$items.product",
//       recommendationCount: { $sum: 1 },
//       averageConfidence: { $avg: 1 }
//     }},
//     { $sort: { recommendationCount: -1 } },
//     { $limit: limit }
//   ]);

//   const productIds = recommendedProducts.map(p => p._id);
//   const products = await Product.find({ 
//     _id: { $in: productIds },
//     inStock: true 
//   });

//   // Add recommendation scores
//   const productsWithScores = products.map(product => {
//     const rec = recommendedProducts.find(
//       r => r._id.toString() === product._id.toString()
//     );
//     return {
//       ...product.toObject(),
//       recommendationScore: rec ? rec.recommendationCount / similarUsers.length : 0
//     };
//   });

//   // If not enough personalized recommendations, supplement with popular products
//   if (productsWithScores.length < limit) {
//     const popularProducts = await getPopularProducts(limit - productsWithScores.length);
//     return [...productsWithScores, ...popularProducts];
//   }

//   return productsWithScores;
// };

// // ============================================
// // ALGORITHM 6: Content-Based Filtering (Similar Products)
// // ============================================
// const getSimilarProducts = async (productId, limit = 5) => {
//   const product = await Product.findById(productId);
  
//   if (!product) {
//     return [];
//   }

//   // Find products in same category with similar price range
//   const similarProducts = await Product.find({
//     _id: { $ne: productId },
//     category: product.category,
//     inStock: true,
//     price: { 
//       $gte: product.price * 0.7,  // Within 70% to 130% of price
//       $lte: product.price * 1.3 
//     }
//   }).limit(limit);

//   // If not enough similar products in same category, get more from same category
//   if (similarProducts.length < limit) {
//     const moreFromCategory = await Product.find({
//       _id: { $ne: productId },
//       category: product.category,
//       inStock: true,
//       _id: { $nin: similarProducts.map(p => p._id) }
//     }).limit(limit - similarProducts.length);
    
//     return [...similarProducts, ...moreFromCategory];
//   }

//   return similarProducts;
// };

// // ============================================
// // ALGORITHM 7: Recently Viewed / Cart-Based Recommendations
// // ============================================
// const getCartBasedRecommendations = async (userId, limit = 10) => {
//   if (!userId) {
//     return [];
//   }

//   // Get user's cart items
//   const user = await User.findById(userId);
  
//   if (!user || !user.cartItems || Object.keys(user.cartItems).length === 0) {
//     return [];
//   }

//   const cartProductIds = Object.keys(user.cartItems);

//   // Get categories of products in cart
//   const cartProducts = await Product.find({
//     _id: { $in: cartProductIds }
//   });

//   const categoryFrequency = {};
//   cartProducts.forEach(product => {
//     categoryFrequency[product.category] = (categoryFrequency[product.category] || 0) + 1;
//   });

//   // Sort categories by frequency
//   const preferredCategories = Object.entries(categoryFrequency)
//     .sort((a, b) => b[1] - a[1])
//     .map(entry => entry[0]);

//   // Get products from preferred categories, excluding those already in cart
//   const recommendations = await Product.find({
//     _id: { $nin: cartProductIds },
//     category: { $in: preferredCategories },
//     inStock: true
//   }).limit(limit);

//   return recommendations;
// };

// // ============================================
// // ALGORITHM 8: Seasonal / Trending Products
// // ============================================
// const getTrendingProducts = async (limit = 10) => {
//   // Get products with increasing order velocity
//   const thirtyDaysAgo = new Date();
//   thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

//   const fifteenDaysAgo = new Date();
//   fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

//   // Compare order counts between last 15 days and previous 15 days
//   const trendingProducts = await Order.aggregate([
//     { $match: { 
//       createdAt: { $gte: thirtyDaysAgo },
//       status: { $ne: "Cancelled" }
//     }},
//     { $unwind: "$items" },
//     { $group: {
//       _id: "$items.product",
//       recentOrders: {
//         $sum: {
//           $cond: [
//             { $gte: ["$createdAt", fifteenDaysAgo] },
//             "$items.quantity",
//             0
//           ]
//         }
//       },
//       previousOrders: {
//         $sum: {
//           $cond: [
//             { $lt: ["$createdAt", fifteenDaysAgo] },
//             "$items.quantity",
//             0
//           ]
//         }
//       }
//     }},
//     { $addFields: {
//       growthRate: {
//         $cond: [
//           { $eq: ["$previousOrders", 0] },
//           1, // If no previous orders, treat as new trend
//           { $divide: ["$recentOrders", "$previousOrders"] }
//         ]
//       }
//     }},
//     { $match: { recentOrders: { $gt: 0 } } },
//     { $sort: { growthRate: -1, recentOrders: -1 } },
//     { $limit: limit }
//   ]);

//   const productIds = trendingProducts.map(p => p._id);
//   const products = await Product.find({ 
//     _id: { $in: productIds },
//     inStock: true 
//   });

//   const orderedProducts = productIds.map(id => 
//     products.find(p => p._id.toString() === id.toString())
//   ).filter(p => p);

//   return orderedProducts;
// };

// // ============================================
// // ALGORITHM 9: Category-Based Recommendations
// // ============================================
// const getCategoryRecommendations = async (category, excludeProductId = null, limit = 10) => {
//   const query = { 
//     category, 
//     inStock: true 
//   };
  
//   if (excludeProductId) {
//     query._id = { $ne: excludeProductId };
//   }

//   const products = await Product.find(query)
//     .sort({ createdAt: -1 })
//     .limit(limit);

//   return products;
// };

// // ============================================
// // ALGORITHM 10: Price Range Recommendations
// // ============================================
// const getPriceRangeRecommendations = async (minPrice, maxPrice, limit = 10) => {
//   const products = await Product.find({
//     offerPrice: { $gte: minPrice, $lte: maxPrice },
//     inStock: true
//   })
//     .sort({ offerPrice: 1 })
//     .limit(limit);

//   return products;
// };

// // ============================================
// // MAIN CONTROLLER: Get All Recommendations
// // ============================================
// export const getRecommendations = async (req, res) => {
//   try {
//     const userId = req.user; // From auth middleware
//     const { 
//       type = 'all', 
//       productId, 
//       category,
//       minPrice,
//       maxPrice,
//       limit = 10 
//     } = req.query;

//     let recommendations = {};

//     switch(type) {
//       case 'new-arrivals':
//         recommendations = {
//           type: 'new-arrivals',
//           title: 'New Arrivals',
//           data: await getNewArrivals(parseInt(limit))
//         };
//         break;

//       case 'popular':
//         recommendations = {
//           type: 'popular',
//           title: 'Popular Products',
//           data: await getPopularProducts(parseInt(limit))
//         };
//         break;

//       case 'best-selling':
//         recommendations = {
//           type: 'best-selling',
//           title: 'Best Selling',
//           data: await getBestSelling(parseInt(limit))
//         };
//         break;

//       case 'frequently-bought':
//         if (!productId) {
//           return res.status(400).json({
//             success: false,
//             message: 'Product ID is required for frequently bought together recommendations'
//           });
//         }
//         recommendations = {
//           type: 'frequently-bought',
//           title: 'Frequently Bought Together',
//           data: await getFrequentlyBoughtTogether(productId, parseInt(limit))
//         };
//         break;

//       case 'personalized':
//         recommendations = {
//           type: 'personalized',
//           title: 'Recommended For You',
//           data: await getPersonalizedRecommendations(userId, parseInt(limit))
//         };
//         break;

//       case 'similar':
//         if (!productId) {
//           return res.status(400).json({
//             success: false,
//             message: 'Product ID is required for similar products recommendations'
//           });
//         }
//         recommendations = {
//           type: 'similar',
//           title: 'Similar Products',
//           data: await getSimilarProducts(productId, parseInt(limit))
//         };
//         break;

//       case 'cart-based':
//         recommendations = {
//           type: 'cart-based',
//           title: 'Based on Your Cart',
//           data: await getCartBasedRecommendations(userId, parseInt(limit))
//         };
//         break;

//       case 'trending':
//         recommendations = {
//           type: 'trending',
//           title: 'Trending Now',
//           data: await getTrendingProducts(parseInt(limit))
//         };
//         break;

//       case 'category':
//         if (!category) {
//           return res.status(400).json({
//             success: false,
//             message: 'Category is required for category-based recommendations'
//           });
//         }
//         recommendations = {
//           type: 'category',
//           title: `Popular in ${category}`,
//           data: await getCategoryRecommendations(category, productId, parseInt(limit))
//         };
//         break;

//       case 'price-range':
//         if (!minPrice || !maxPrice) {
//           return res.status(400).json({
//             success: false,
//             message: 'Min and max price are required for price range recommendations'
//           });
//         }
//         recommendations = {
//           type: 'price-range',
//           title: `Products $${minPrice} - $${maxPrice}`,
//           data: await getPriceRangeRecommendations(
//             parseFloat(minPrice), 
//             parseFloat(maxPrice), 
//             parseInt(limit)
//           )
//         };
//         break;

//       case 'all':
//       default:
//         // Return multiple recommendation types
//         const [newArrivals, popular, personalized, trending] = await Promise.all([
//           getNewArrivals(5),
//           getPopularProducts(5),
//           getPersonalizedRecommendations(userId, 5),
//           getTrendingProducts(5)
//         ]);

//         recommendations = {
//           success: true,
//           data: {
//             newArrivals: {
//               title: 'New Arrivals',
//               data: newArrivals
//             },
//             popular: {
//               title: 'Popular Products',
//               data: popular
//             },
//             personalized: {
//               title: userId ? 'Recommended For You' : 'Trending Now',
//               data: userId ? personalized : trending
//             },
//             trending: {
//               title: 'Trending Now',
//               data: trending
//             }
//           }
//         };
        
//         return res.status(200).json(recommendations);
//     }

//     res.status(200).json({
//       success: true,
//       data: recommendations
//     });

//   } catch (error) {
//     console.error("Recommendation Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error generating recommendations",
//       error: error.message
//     });
//   }
// };

// // ============================================
// // Get Multiple Recommendation Types in One Request
// // ============================================
// export const getMultiTypeRecommendations = async (req, res) => {
//   try {
//     const userId = req.user;
//     const { types = 'new-arrivals,popular,personalized', limit = 5 } = req.query;
    
//     const typeArray = types.split(',');
//     const limitNum = parseInt(limit);
    
//     const recommendationPromises = typeArray.map(async (type) => {
//       switch(type.trim()) {
//         case 'new-arrivals':
//           return {
//             type: 'new-arrivals',
//             title: 'New Arrivals',
//             data: await getNewArrivals(limitNum)
//           };
//         case 'popular':
//           return {
//             type: 'popular',
//             title: 'Popular Products',
//             data: await getPopularProducts(limitNum)
//           };
//         case 'best-selling':
//           return {
//             type: 'best-selling',
//             title: 'Best Selling',
//             data: await getBestSelling(limitNum)
//           };
//         case 'personalized':
//           return {
//             type: 'personalized',
//             title: 'Recommended For You',
//             data: await getPersonalizedRecommendations(userId, limitNum)
//           };
//         case 'cart-based':
//           return {
//             type: 'cart-based',
//             title: 'Based on Your Cart',
//             data: await getCartBasedRecommendations(userId, limitNum)
//           };
//         case 'trending':
//           return {
//             type: 'trending',
//             title: 'Trending Now',
//             data: await getTrendingProducts(limitNum)
//           };
//         default:
//           return null;
//       }
//     });

//     const results = await Promise.all(recommendationPromises);
//     const validResults = results.filter(r => r !== null);

//     res.status(200).json({
//       success: true,
//       data: validResults
//     });

//   } catch (error) {
//     console.error("Multi-type Recommendation Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error generating recommendations",
//       error: error.message
//     });
//   }
// };

// // ============================================
// // Get Homepage Recommendations (Optimized for Frontend)
// // ============================================
// export const getHomepageRecommendations = async (req, res) => {
//   try {
//     const userId = req.user;
    
//     // Fetch different types of recommendations in parallel
//     const [
//       newArrivals,
//       trending,
//       popular,
//       personalized,
//       cartBased
//     ] = await Promise.all([
//       getNewArrivals(8),
//       getTrendingProducts(8),
//       getPopularProducts(8),
//       getPersonalizedRecommendations(userId, 8),
//       getCartBasedRecommendations(userId, 8)
//     ]);

//     const response = {
//       success: true,
//       data: {
//         hero: newArrivals.slice(0, 1)[0] || null, // Featured product for hero section
//         sections: [
//           {
//             id: 'new-arrivals',
//             title: 'New Arrivals',
//             subtitle: 'Check out our latest products',
//             products: newArrivals
//           },
//           {
//             id: 'trending',
//             title: 'Trending Now',
//             subtitle: 'Most popular products this week',
//             products: trending
//           },
//           {
//             id: 'popular',
//             title: 'Popular Products',
//             subtitle: 'Customer favorites',
//             products: popular
//           }
//         ]
//       }
//     };

//     // Add personalized section if user is logged in
//     if (userId) {
//       response.data.sections.push({
//         id: 'personalized',
//         title: 'Recommended For You',
//         subtitle: 'Based on your shopping history',
//         products: personalized
//       });

//       if (cartBased.length > 0) {
//         response.data.sections.push({
//           id: 'cart-based',
//           title: 'Complete Your Cart',
//           subtitle: 'Based on items in your cart',
//           products: cartBased
//         });
//       }
//     }

//     res.status(200).json(response);

//   } catch (error) {
//     console.error("Homepage Recommendations Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error generating homepage recommendations",
//       error: error.message
//     });
//   }
// };





// controller/recommendation.controller.js
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";

// ============================================
// ALGORITHM 1: New Arrivals / Recently Added
// ============================================
const getNewArrivals = async (limit = 10) => {
  const newProducts = await Product.find({ inStock: true })
    .sort({ createdAt: -1 })
    .limit(limit);
  return newProducts;
};

// ============================================
// ALGORITHM 2: Popular Products (Based on Order Frequency)
// ============================================
// const getPopularProducts = async (limit = 10) => {
//   const popularProducts = await Order.aggregate([
//     { $match: { status: { $ne: "Cancelled" } } },
//     { $unwind: "$items" },
//     { 
//       $group: {
//         _id: "$items.product",
//         orderCount: { $sum: 1 },
//         totalQuantity: { $sum: "$items.quantity" }
//       }
//     },
//     { $sort: { orderCount: -1, totalQuantity: -1 } },
//     { $limit: limit }
//   ]);

//   const productIds = popularProducts.map(p => p._id);
//   const products = await Product.find({ 
//     _id: { $in: productIds },
//     inStock: true 
//   });

//   const orderedProducts = productIds.map(id => 
//     products.find(p => p._id.toString() === id.toString())
//   ).filter(p => p);

//   return orderedProducts;
// };

const getPopularProducts = async (limit = 10) => {
  const popularProducts = await Order.aggregate([
    { $match: { status: { $ne: "Cancelled" } } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        orderCount: { $sum: 1 },
        totalQuantity: { $sum: "$items.quantity" }
      }
    },
    { $sort: { orderCount: -1, totalQuantity: -1 } },
    { $limit: limit }
  ]);

  const productIds = popularProducts.map(p => p._id);
  const orderedProducts = await Product.find({
    _id: { $in: productIds },
    inStock: true
  });

  const sortedByOrders = productIds
    .map(id => orderedProducts.find(p => p._id.toString() === id.toString()))
    .filter(p => p);

  // If we have fewer results than the limit, fill with newest products
  if (sortedByOrders.length < limit) {
    const existingIds = sortedByOrders.map(p => p._id.toString());
    const remaining = limit - sortedByOrders.length;

    const fillProducts = await Product.find({
      _id: { $nin: existingIds },
      inStock: true
    })
      .sort({ _id: -1 }) // newest first (MongoDB ObjectId encodes creation time)
      .limit(remaining);

    return [...sortedByOrders, ...fillProducts];
  }

  return sortedByOrders;
};

// ============================================
// ALGORITHM 3: Best Selling (Based on Revenue)
// ============================================
const getBestSelling = async (limit = 10) => {
  const bestSelling = await Order.aggregate([
    { $match: { status: { $ne: "Cancelled" }, isPaid: true } },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "productDetails"
      }
    },
    { $unwind: "$productDetails" },
    {
      $group: {
        _id: "$items.product",
        totalRevenue: { 
          $sum: { 
            $multiply: ["$productDetails.offerPrice", "$items.quantity"] 
          } 
        },
        totalQuantity: { $sum: "$items.quantity" },
        orderCount: { $sum: 1 }
      }
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: limit }
  ]);

  const productIds = bestSelling.map(p => p._id);
  const products = await Product.find({ 
    _id: { $in: productIds },
    inStock: true 
  });

  const orderedProducts = productIds.map(id => 
    products.find(p => p._id.toString() === id.toString())
  ).filter(p => p);

  return orderedProducts;
};

// ============================================
// ALGORITHM 4: Trending Products
// ============================================
const getTrendingProducts = async (limit = 10) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const fifteenDaysAgo = new Date();
  fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

  const trendingProducts = await Order.aggregate([
    { 
      $match: { 
        createdAt: { $gte: thirtyDaysAgo },
        status: { $ne: "Cancelled" }
      }
    },
    { $unwind: "$items" },
    { 
      $group: {
        _id: "$items.product",
        recentOrders: {
          $sum: {
            $cond: [
              { $gte: ["$createdAt", fifteenDaysAgo] },
              "$items.quantity",
              0
            ]
          }
        },
        previousOrders: {
          $sum: {
            $cond: [
              { $lt: ["$createdAt", fifteenDaysAgo] },
              "$items.quantity",
              0
            ]
          }
        }
      }
    },
    { 
      $addFields: {
        growthRate: {
          $cond: [
            { $eq: ["$previousOrders", 0] },
            1,
            { $divide: ["$recentOrders", "$previousOrders"] }
          ]
        }
      }
    },
    { $match: { recentOrders: { $gt: 0 } } },
    { $sort: { growthRate: -1, recentOrders: -1 } },
    { $limit: limit }
  ]);

  const productIds = trendingProducts.map(p => p._id);
  const products = await Product.find({ 
    _id: { $in: productIds },
    inStock: true 
  });

  const orderedProducts = productIds.map(id => 
    products.find(p => p._id.toString() === id.toString())
  ).filter(p => p);

  return orderedProducts;
};

// ============================================
// MAIN CONTROLLER: Get Multiple Recommendation Types
// ============================================
export const getMultiTypeRecommendations = async (req, res) => {
  try {
    const { types = 'popular,best-selling,trending', limit = 5 } = req.query;
    
    const typeArray = types.split(',');
    const limitNum = parseInt(limit);
    
    const recommendationPromises = typeArray.map(async (type) => {
      switch(type.trim()) {
        case 'popular':
          return {
            type: 'popular',
            title: 'Popular Products',
            data: await getPopularProducts(limitNum)
          };
        case 'best-selling':
          return {
            type: 'best-selling',
            title: 'Best Sellers',
            data: await getBestSelling(limitNum)
          };
        case 'trending':
          return {
            type: 'trending',
            title: 'Trending Now',
            data: await getTrendingProducts(limitNum)
          };
        case 'new-arrivals':
          return {
            type: 'new-arrivals',
            title: 'New Arrivals',
            data: await getNewArrivals(limitNum)
          };
        default:
          return null;
      }
    });

    const results = await Promise.all(recommendationPromises);
    const validResults = results.filter(r => r !== null);

    res.status(200).json({
      success: true,
      data: validResults
    });

  } catch (error) {
    console.error("Recommendation Error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating recommendations",
      error: error.message
    });
  }
};