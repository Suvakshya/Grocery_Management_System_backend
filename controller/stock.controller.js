import Product from "../models/product.model.js";

// Get low stock products
export const getLowStockProducts = async (req, res) => {
  try {
    const { threshold = 10 } = req.query; // Default threshold is 10
    
    const products = await Product.find({
      stockQuantity: { $lte: parseInt(threshold) },
      inStock: true
    }).sort({ stockQuantity: 1 });

    const totalLowStock = products.length;
    const criticalStock = products.filter(p => p.stockQuantity <= 5).length;
    const outOfStock = await Product.countDocuments({ inStock: false });

    res.status(200).json({
      success: true,
      data: {
        products,
        summary: {
          totalLowStock,
          criticalStock,
          outOfStock,
          threshold: parseInt(threshold)
        }
      }
    });
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching low stock products",
      error: error.message
    });
  }
};

// Get stock statistics
export const getStockStatistics = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const inStock = await Product.countDocuments({ inStock: true });
    const outOfStock = await Product.countDocuments({ inStock: false });
    
    const lowStockCount = await Product.countDocuments({
      stockQuantity: { $lte: 10 },
      inStock: true
    });

    const criticalStockCount = await Product.countDocuments({
      stockQuantity: { $lte: 5 },
      inStock: true
    });

    // Get products that need immediate attention (critical stock)
    const criticalProducts = await Product.find({
      stockQuantity: { $lte: 5 },
      inStock: true
    }).select('name stockQuantity category').limit(5);

    // Calculate average stock level
    const allProducts = await Product.find({ inStock: true });
    const avgStock = allProducts.reduce((sum, p) => sum + p.stockQuantity, 0) / (allProducts.length || 1);

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        inStock,
        outOfStock,
        lowStockCount,
        criticalStockCount,
        avgStock: Math.round(avgStock * 100) / 100,
        criticalProducts,
        stockHealth: {
          healthy: totalProducts - lowStockCount - outOfStock,
          lowStock: lowStockCount,
          critical: criticalStockCount,
          outOfStock
        }
      }
    });
  } catch (error) {
    console.error("Error fetching stock statistics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching stock statistics",
      error: error.message
    });
  }
};

// Update stock quantity
export const updateBulkStock = async (req, res) => {
  try {
    const { updates } = req.body; // Array of { productId, stockQuantity }
    
    const updatePromises = updates.map(update => 
      Product.findByIdAndUpdate(
        update.productId,
        { 
          stockQuantity: update.stockQuantity,
          inStock: update.stockQuantity > 0 
        },
        { new: true }
      )
    );

    const updatedProducts = await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      data: updatedProducts
    });
  } catch (error) {
    console.error("Error updating bulk stock:", error);
    res.status(500).json({
      success: false,
      message: "Error updating stock",
      error: error.message
    });
  }
};

// Get stock alerts (for notification bell)
export const getStockAlerts = async (req, res) => {
  try {
    const criticalStock = await Product.countDocuments({
      stockQuantity: { $lte: 5 },
      inStock: true
    });

    const lowStock = await Product.countDocuments({
      stockQuantity: { $gt: 5, $lte: 10 },
      inStock: true
    });

    const outOfStock = await Product.countDocuments({ inStock: false });

    const alerts = [];
    
    if (criticalStock > 0) {
      alerts.push({
        type: 'critical',
        message: `${criticalStock} product(s) critically low (≤5 units)`,
        severity: 'high',
        count: criticalStock
      });
    }
    
    if (lowStock > 0) {
      alerts.push({
        type: 'warning',
        message: `${lowStock} product(s) running low (≤10 units)`,
        severity: 'medium',
        count: lowStock
      });
    }
    
    if (outOfStock > 0) {
      alerts.push({
        type: 'danger',
        message: `${outOfStock} product(s) out of stock`,
        severity: 'high',
        count: outOfStock
      });
    }

    // Get the most critical products for quick view
    const criticalProducts = await Product.find({
      stockQuantity: { $lte: 5 },
      inStock: true
    })
      .select('name stockQuantity category image')
      .sort({ stockQuantity: 1 })
      .limit(3);

    res.status(200).json({
      success: true,
      data: {
        totalAlerts: alerts.length,
        alerts,
        criticalProducts,
        summary: {
          critical: criticalStock,
          low: lowStock,
          outOfStock
        }
      }
    });
  } catch (error) {
    console.error("Error fetching stock alerts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching stock alerts",
      error: error.message
    });
  }
};