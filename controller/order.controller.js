// import User from "../models/user.model.js";
// import Order from "../models/order.model.js";
// import Product from "../models/product.model.js";
// import PayPalService from '../helper/paypalService.js';

// // Update user cartData: /api/cart/update
// export const updateCart = async (req, res) => {
//   try {
//     const userId = req.user;
//     const { cartItems } = req.body;
//     await User.findByIdAndUpdate(userId, { cartItems }, { new: true });
//     res.status(200).json({ success: true, message: "Cart updated" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // Place order COD: /api/order/place
// export const placeOrderCOD = async (req, res) => {
//   try {
//     const userId = req.user;
//     const { items, address } = req.body;
    
//     if (!address || !items || items.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "Invalid order details", success: false });
//     }
    
//     // Calculate amount using items
//     let amount = 0;
//     for (const item of items) {
//       const product = await Product.findById(item.product);
//       if (product) {
//         amount += product.offerPrice * item.quantity;
//       }
//     }

//     // Add tax charge 2%
//     amount += Math.floor((amount * 2) / 100);
    
//     await Order.create({
//       userId,
//       items,
//       address,
//       amount,
//       paymentType: "COD",
//       isPaid: false,
//     });
    
//     res
//       .status(201)
//       .json({ message: "Order placed successfully", success: true });
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// };

// // Create PayPal order: /api/paypal/create-order
// export const createPaypalOrder = async (req, res) => {
//   try {
//     const userId = req.user;
//     const { items, address } = req.body;

//     if (!address || !items || items.length === 0) {
//       return res.status(400).json({ 
//         message: "Invalid order details", 
//         success: false 
//       });
//     }

//     // Calculate total amount
//     let totalAmount = 0;
//     for (const item of items) {
//       const product = await Product.findById(item.product);
//       if (product) {
//         totalAmount += product.offerPrice * item.quantity;
//       }
//     }
    
//     // Add tax 2%
//     totalAmount += (totalAmount * 0.02);
    
//     // Store order details temporarily (you might want to use a temporary storage like Redis)
//     // For now, we'll include the necessary data in the return URL
    
//     const returnUrl = `${process.env.FRONTEND_URL}/payment-success?userId=${userId}&totalAmount=${totalAmount.toFixed(2)}`;
//     const cancelUrl = `${process.env.FRONTEND_URL}/cart`;

//     const order = await PayPalService.createOrder(totalAmount, returnUrl, cancelUrl);

//     // Find the approval URL
//     const approvalLink = order.links.find(link => link.rel === 'approve');
    
//     if (!approvalLink) {
//       throw new Error('No approval URL found in PayPal response');
//     }

//     // Store order details in session or database temporarily
//     // This is important to recreate the order after payment confirmation
//     req.session.pendingOrder = {
//       userId,
//       items,
//       address,
//       totalAmount,
//       paypalOrderId: order.id
//     };

//     res.status(200).json({
//       success: true,
//       orderId: order.id,
//       approvalUrl: approvalLink.href
//     });

//   } catch (error) {
//     console.error("PayPal Error:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: "PayPal payment creation failed",
//       error: error.message
//     });
//   }
// };

// // Capture PayPal payment: /api/paypal/capture-payment
// export const capturePaypalPayment = async (req, res) => {
//   try {
//     const { orderId } = req.body;
    
//     // In a real application, you would retrieve the order details from your temporary storage
//     // For this example, I'm assuming you're storing it in the session
//     const pendingOrder = req.session.pendingOrder;
    
//     if (!pendingOrder || pendingOrder.paypalOrderId !== orderId) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Order not found or mismatch" 
//       });
//     }

//     const captureData = await PayPalService.captureOrder(orderId);

//     if (captureData.status === 'COMPLETED') {
//       // Create order in database
//       await Order.create({
//         userId: pendingOrder.userId,
//         items: pendingOrder.items,
//         address: pendingOrder.address,
//         amount: pendingOrder.totalAmount,
//         paymentType: "PayPal",
//         isPaid: true,
//         status: "Payment Completed",
//         paypalOrderId: orderId
//       });

//       // Clear the pending order from session
//       delete req.session.pendingOrder;

//       return res.status(200).json({ 
//         success: true, 
//         message: "Payment successful and order created",
//         orderDetails: captureData 
//       });
//     } else {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Payment not completed" 
//       });
//     }

//   } catch (error) {
//     console.error("Payment Capture Error:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: "Payment capture failed",
//       error: error.message
//     });
//   }
// };

// // Order details for individual user: /api/order/user
// export const getUserOrders = async (req, res) => {
//   try {
//     const userId = req.user;
//     const orders = await Order.find({
//       userId,
//       $or: [{ paymentType: "COD" }, { isPaid: true }],
//     })
//       .populate("items.product address")
//       .sort({ createdAt: -1 });
//     res.status(200).json({ success: true, orders });
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// };

// // Get all orders for admin: /api/order/all
// export const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({
//       $or: [{ paymentType: "COD" }, { isPaid: true }],
//     })
//       .populate("items.product address")
//       .sort({ createdAt: -1 });
//     res.status(200).json({ success: true, orders });
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// };






import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import PayPalService from '../helper/paypalService.js';

// Update user cartData: /api/cart/update
export const updateCart = async (req, res) => {
  try {
    const userId = req.user;
    const { cartItems } = req.body;
    await User.findByIdAndUpdate(userId, { cartItems }, { new: true });
    res.status(200).json({ success: true, message: "Cart updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Place order COD: /api/order/place
// export const placeOrderCOD = async (req, res) => {
//   try {
//     const userId = req.user;
//     const { items, address } = req.body;
//     if (!address || !items || items.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "Invalid order details", success: false });
//     }
//     // Calculate amount using items
//     let amount = 0;
//     for (const item of items) {
//       const product = await Product.findById(item.product);
//       if (product) {
//         amount += product.offerPrice * item.quantity;
//       }
//     }
//     // Add tax charge 2%
//     amount += Math.floor((amount * 2) / 100);
//     await Order.create({
//       userId,
//       items,
//       address,
//       amount,
//       paymentType: "COD",
//       isPaid: false,
//     });
//     res
//       .status(201)
//       .json({ message: "Order placed successfully", success: true });
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// };



export const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.user;
    const { items, address } = req.body;
    
    if (!address || !items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid order details", success: false });
    }
    
    // Calculate amount using items
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) {
        amount += product.offerPrice * item.quantity;
      }
    }

    // Add tax charge 2%
    amount += Math.floor((amount * 2) / 100);
    
    await Order.create({
      userId,
      items,
      address,
      amount,
      paymentType: "COD",
      isPaid: false,
    });
    
    res.status(201).json({ 
      message: "Order placed successfully", 
      success: true,
      recommendationUpdate: true 
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Create PayPal order: /api/paypal/create-order
export const createPaypalOrder = async (req, res) => {
  try {
    const userId = req.user;
    const { items, address } = req.body;
    if (!address || !items || items.length === 0) {
      return res.status(400).json({ message: "Invalid order details", success: false });
    }
    // Calculate total amount
    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) {
        totalAmount += product.offerPrice * item.quantity;
      }
    }
    // Add tax 2%
    totalAmount += (totalAmount * 0.02);
    // Store order details temporarily (you might want to use a temporary storage like Redis)
    // For now, we'll include the necessary data in the return URL
    const returnUrl = `${process.env.FRONTEND_URL}/payment-success?userId=${userId}&totalAmount=${totalAmount.toFixed(2)}`;
    const cancelUrl = `${process.env.FRONTEND_URL}/cart`;
    const order = await PayPalService.createOrder(totalAmount, returnUrl, cancelUrl);
    // Find the approval URL
    const approvalLink = order.links.find(link => link.rel === 'approve');
    if (!approvalLink) {
      throw new Error('No approval URL found in PayPal response');
    }
    // Store order details in session or database temporarily
    // This is important to recreate the order after payment confirmation
    req.session.pendingOrder = {
      userId,
      items,
      address,
      totalAmount,
      paypalOrderId: order.id
    };
    res.status(200).json({
      success: true,
      orderId: order.id,
      approvalUrl: approvalLink.href
    });
  } catch (error) {
    console.error("PayPal Error:", error);
    res.status(500).json({
      success: false,
      message: "PayPal payment creation failed",
      error: error.message
    });
  }
};

// Capture PayPal payment: /api/paypal/capture-payment
export const capturePaypalPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    // In a real application, you would retrieve the order details from your temporary storage
    // For this example, I'm assuming you're storing it in the session
    const pendingOrder = req.session.pendingOrder;
    if (!pendingOrder || pendingOrder.paypalOrderId !== orderId) {
      return res.status(400).json({
        success: false,
        message: "Order not found or mismatch"
      });
    }
    const captureData = await PayPalService.captureOrder(orderId);
    if (captureData.status === 'COMPLETED') {
      // Create order in database
      await Order.create({
        userId: pendingOrder.userId,
        items: pendingOrder.items,
        address: pendingOrder.address,
        amount: pendingOrder.totalAmount,
        paymentType: "PayPal",
        isPaid: true,
        status: "Payment Completed",
        paypalOrderId: orderId
      });
      // Clear the pending order from session
      delete req.session.pendingOrder;
      return res.status(200).json({
        success: true,
        message: "Payment successful and order created",
        orderDetails: captureData
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment not completed"
      });
    }
  } catch (error) {
    console.error("Payment Capture Error:", error);
    res.status(500).json({
      success: false,
      message: "Payment capture failed",
      error: error.message
    });
  }
};

// Order details for individual user: /api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user;
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get all orders for admin: /api/order/all
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// ============================================
// NEW FUNCTION: Update order payment status
// ============================================
export const updateOrderPayment = async (req, res) => {
  try {
    const { orderId, isPaid } = req.body;
    
    // Verify required fields
    if (!orderId || isPaid === undefined) {
      return res.status(400).json({
        success: false,
        message: "Order ID and payment status are required"
      });
    }

    // Update the order
    const order = await Order.findByIdAndUpdate(
      orderId,
      { isPaid: isPaid },
      { new: true }
    ).populate("items.product address");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      order
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

// ============================================
// NEW FUNCTION: Update order status (if needed)
// ============================================
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    
    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "Order ID and status are required"
      });
    }

    const validStatuses = ["Order Placed", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true }
    ).populate("items.product address");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};