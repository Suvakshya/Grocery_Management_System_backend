import PayPalService from '../helper/paypalService.js';
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

// Create PayPal order: /api/payment/create-paypal-order
export const createPaypalOrder = async (req, res) => {
  try {
    const userId = req.user;
    const { items, address } = req.body;

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

    // Create PayPal order
    const order = await PayPalService.createOrder(totalAmount);

    // Find the approval URL
    const approvalLink = order.links.find(link => link.rel === 'approve');
    
    // Save order to database as pending
    const dbOrder = await Order.create({
      userId,
      items,
      address,
      amount: totalAmount,
      paymentType: "PayPal",
      isPaid: false,
      status: "Pending Payment",
      paypalOrderId: order.id
    });

    res.status(200).json({
      success: true,
      orderId: order.id,
      approvalUrl: approvalLink.href,
      dbOrderId: dbOrder._id // Send our database order ID to frontend
    });

  } catch (error) {
    console.error("PayPal Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Payment creation failed"
    });
  }
};

// Capture PayPal payment: /api/payment/capture-payment
export const capturePaypalPayment = async (req, res) => {
  try {
    const { orderId, dbOrderId } = req.body;

    // Capture payment with PayPal
    const captureData = await PayPalService.captureOrder(orderId);

    if (captureData.status === 'COMPLETED') {
      // Update our database order to mark as paid
      await Order.findByIdAndUpdate(dbOrderId, {
        isPaid: true,
        status: "Payment Completed"
      });

      res.status(200).json({ 
        success: true, 
        message: "Payment successful" 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: "Payment not completed" 
      });
    }

  } catch (error) {
    console.error("Payment Capture Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Payment capture failed"
    });
  }
};