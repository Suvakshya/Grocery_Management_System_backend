import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Address from "../models/address.model.js";

// Get all users for admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message
    });
  }
};

// Get single user details with statistics
export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user details
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Get user's addresses
    const addresses = await Address.find({ userId });

    // Get user's orders with populated product details
    const orders = await Order.find({ userId })
      .populate("items.product")
      .sort({ createdAt: -1 });

    // Calculate user statistics
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.amount, 0);
    const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
    
    // Orders by status
    const ordersByStatus = {};
    orders.forEach(order => {
      ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;
    });

    // Payment statistics
    const paidOrders = orders.filter(o => o.isPaid).length;
    const pendingOrders = orders.filter(o => !o.isPaid).length;
    
    // Payment method distribution
    const paymentMethods = {};
    orders.forEach(order => {
      paymentMethods[order.paymentType] = (paymentMethods[order.paymentType] || 0) + 1;
    });

    // Monthly spending trend (last 6 months)
    const monthlySpending = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate.getMonth() === month.getMonth() &&
               orderDate.getFullYear() === month.getFullYear();
      });
      const monthTotal = monthOrders.reduce((sum, o) => sum + o.amount, 0);
      monthlySpending.push({
        month: month.toLocaleString('default', { month: 'short' }),
        year: month.getFullYear(),
        amount: monthTotal
      });
    }

    // Favorite products (most ordered)
    const productCount = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const productId = item.product?._id || 'unknown';
        const productName = item.product?.name || 'Unknown Product';
        if (!productCount[productId]) {
          productCount[productId] = {
            name: productName,
            quantity: 0,
            totalSpent: 0
          };
        }
        productCount[productId].quantity += item.quantity;
        productCount[productId].totalSpent += (item.product?.offerPrice || 0) * item.quantity;
      });
    });

    const favoriteProducts = Object.values(productCount)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Customer lifetime value (simplified)
    const accountAge = Math.max(1, (today - new Date(user.createdAt)) / (1000 * 60 * 60 * 24 * 30)); // in months
    const monthlyAverage = totalSpent / accountAge;
    const projectedAnnualValue = monthlyAverage * 12;
    const lifetimeValue = monthlyAverage * 36; // 3 years projection

    // Churn risk (based on last order)
    const lastOrder = orders[0];
    let churnRisk = "Low";
    if (lastOrder) {
      const daysSinceLastOrder = (today - new Date(lastOrder.createdAt)) / (1000 * 60 * 60 * 24);
      if (daysSinceLastOrder > 60) churnRisk = "High";
      else if (daysSinceLastOrder > 30) churnRisk = "Medium";
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        addresses,
        statistics: {
          totalOrders,
          totalSpent,
          avgOrderValue,
          ordersByStatus,
          paidOrders,
          pendingOrders,
          paymentMethods,
          monthlySpending,
          favoriteProducts,
          customerMetrics: {
            accountAge: Math.round(accountAge),
            monthlyAverage,
            projectedAnnualValue,
            lifetimeValue,
            churnRisk,
            lastOrderDate: lastOrder?.createdAt || null
          }
        }
      }
    });

  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user details",
      error: error.message
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Delete user's addresses
    await Address.deleteMany({ userId });
    
    // Delete user's orders (optional - you might want to keep orders for analytics)
    // await Order.deleteMany({ userId });
    
    // Delete user
    await User.findByIdAndDelete(userId);
    
    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message
    });
  }
};