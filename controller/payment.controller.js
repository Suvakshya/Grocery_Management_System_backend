// // import PayPalService from '../helper/paypalService.js';
// // import Order from "../models/order.model.js";
// // import Product from "../models/product.model.js";

// // // Create PayPal order: /api/payment/create-paypal-order
// // export const createPaypalOrder = async (req, res) => {
// //   try {
// //     const userId = req.user;
// //     const { items, address } = req.body;

// //     // Calculate total amount
// //     let totalAmount = 0;
// //     for (const item of items) {
// //       const product = await Product.findById(item.product);
// //       if (product) {
// //         totalAmount += product.offerPrice * item.quantity;
// //       }
// //     }
    
// //     // Add tax 2%
// //     totalAmount += (totalAmount * 0.02);

// //     // Create PayPal order
// //     const order = await PayPalService.createOrder(totalAmount);

// //     // Find the approval URL
// //     const approvalLink = order.links.find(link => link.rel === 'approve');
    
// //     // Save order to database as pending
// //     const dbOrder = await Order.create({
// //       userId,
// //       items,
// //       address,
// //       amount: totalAmount,
// //       paymentType: "PayPal",
// //       isPaid: false,
// //       status: "Pending Payment",
// //       paypalOrderId: order.id
// //     });

// //     res.status(200).json({
// //       success: true,
// //       orderId: order.id,
// //       approvalUrl: approvalLink.href,
// //       dbOrderId: dbOrder._id // Send our database order ID to frontend
// //     });

// //   } catch (error) {
// //     console.error("PayPal Error:", error);
// //     res.status(500).json({ 
// //       success: false, 
// //       message: "Payment creation failed"
// //     });
// //   }
// // };

// // // Capture PayPal payment: /api/payment/capture-payment
// // export const capturePaypalPayment = async (req, res) => {
// //   try {
// //     const { orderId, dbOrderId } = req.body;

// //     // Capture payment with PayPal
// //     const captureData = await PayPalService.captureOrder(orderId);

// //     if (captureData.status === 'COMPLETED') {
// //       // Update our database order to mark as paid
// //       await Order.findByIdAndUpdate(dbOrderId, {
// //         isPaid: true,
// //         status: "Payment Completed"
// //       });

// //       res.status(200).json({ 
// //         success: true, 
// //         message: "Payment successful" 
// //       });
// //     } else {
// //       res.status(400).json({ 
// //         success: false, 
// //         message: "Payment not completed" 
// //       });
// //     }

// //   } catch (error) {
// //     console.error("Payment Capture Error:", error);
// //     res.status(500).json({ 
// //       success: false, 
// //       message: "Payment capture failed"
// //     });
// //   }
// // };






// // import StripeService from '../helper/paypalService.js';
// // import Order from '../models/order.model.js';
// // import Product from '../models/product.model.js';

// // export const createPaypalOrder = async (req, res) => {
// //   try {
// //     const userId = req.user;
// //     const { items, address, totalAmount } = req.body;
    
// //     if (!address || !items || items.length === 0) {
// //       return res.status(400).json({ 
// //         message: "Invalid order details", 
// //         success: false 
// //       });
// //     }
    
// //     // Prepare items for Stripe
// //     const lineItems = [];
// //     let calculatedAmount = totalAmount;
    
// //     for (const item of items) {
// //       const product = await Product.findById(item.product);
// //       if (!product) {
// //         return res.status(404).json({
// //           success: false,
// //           message: `Product not found`
// //         });
// //       }
      
// //       if (product.stockQuantity < item.quantity) {
// //         return res.status(400).json({
// //           success: false,
// //           message: `Only ${product.stockQuantity} ${product.name} available in stock`
// //         });
// //       }
      
// //       lineItems.push({
// //         name: product.name,
// //         price: product.offerPrice,
// //         quantity: item.quantity,
// //         productId: product._id
// //       });
      
// //       calculatedAmount = totalAmount || (product.offerPrice * item.quantity);
// //     }
    
// //     // Create temporary order in database with pending status
// //     const tempOrder = await Order.create({
// //       userId,
// //       items: items,
// //       address,
// //       amount: calculatedAmount + (calculatedAmount * 0.02),
// //       paymentType: "Stripe",
// //       isPaid: false,
// //       status: "Pending Payment"
// //     });
    
// //     const successUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-success`;
// //     const cancelUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/cart`;
    
// //     const session = await StripeService.createPaymentSession(
// //       lineItems,
// //       calculatedAmount,
// //       tempOrder._id.toString(),
// //       successUrl,
// //       cancelUrl
// //     );
    
// //     // Store session info
// //     req.session.pendingOrder = {
// //       userId,
// //       items,
// //       address,
// //       totalAmount: calculatedAmount,
// //       orderId: tempOrder._id,
// //       sessionId: session.id
// //     };
    
// //     res.status(200).json({
// //       success: true,
// //       sessionId: session.id,
// //       url: session.url
// //     });
// //   } catch (error) {
// //     console.error("Stripe Error:", error);
// //     res.status(500).json({
// //       success: false,
// //       message: error.message || "Payment creation failed"
// //     });
// //   }
// // };

// // export const capturePaypalPayment = async (req, res) => {
// //   try {
// //     const { sessionId } = req.body;
    
// //     const pendingOrder = req.session.pendingOrder;
// //     if (!pendingOrder || pendingOrder.sessionId !== sessionId) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Order not found or mismatch"
// //       });
// //     }
    
// //     const session = await StripeService.retrieveSession(sessionId);
    
// //     if (session.payment_status === 'paid') {
// //       // Deduct stock for each item
// //       for (const item of pendingOrder.items) {
// //         const product = await Product.findById(item.product);
// //         if (product) {
// //           product.stockQuantity -= item.quantity;
// //           if (product.stockQuantity === 0) {
// //             product.inStock = false;
// //           }
// //           await product.save();
// //         }
// //       }
      
// //       // Update order as paid
// //       await Order.findByIdAndUpdate(pendingOrder.orderId, {
// //         isPaid: true,
// //         status: "Payment Completed",
// //         stripeSessionId: sessionId
// //       });
      
// //       delete req.session.pendingOrder;
      
// //       return res.status(200).json({
// //         success: true,
// //         message: "Payment successful and order created"
// //       });
// //     } else {
// //       // Delete the pending order if payment failed
// //       await Order.findByIdAndDelete(pendingOrder.orderId);
      
// //       return res.status(400).json({
// //         success: false,
// //         message: "Payment not completed"
// //       });
// //     }
// //   } catch (error) {
// //     console.error("Payment Capture Error:", error);
// //     res.status(500).json({
// //       success: false,
// //       message: error.message || "Payment capture failed"
// //     });
// //   }
// // };










// // import StripeService from '../helper/paypalService.js';
// // import Order from '../models/order.model.js';
// // import Product from '../models/product.model.js';

// // export const createPaypalOrder = async (req, res) => {
// //   try {
// //     const userId = req.user;
// //     const { items, address, totalAmount } = req.body;
    
// //     if (!address || !items || items.length === 0) {
// //       return res.status(400).json({ 
// //         message: "Invalid order details", 
// //         success: false 
// //       });
// //     }
    
// //     // Prepare items for Stripe
// //     const lineItems = [];
// //     let calculatedAmount = totalAmount || 0;
    
// //     for (const item of items) {
// //       const product = await Product.findById(item.product);
// //       if (!product) {
// //         return res.status(404).json({
// //           success: false,
// //           message: `Product not found`
// //         });
// //       }
      
// //       if (product.stockQuantity < item.quantity) {
// //         return res.status(400).json({
// //           success: false,
// //           message: `Only ${product.stockQuantity} ${product.name} available in stock`
// //         });
// //       }
      
// //       lineItems.push({
// //         name: product.name,
// //         price: product.offerPrice,
// //         quantity: item.quantity,
// //         productId: product._id
// //       });
      
// //       if (!totalAmount) {
// //         calculatedAmount += product.offerPrice * item.quantity;
// //       }
// //     }
    
// //     if (!totalAmount) {
// //       calculatedAmount += (calculatedAmount * 0.02);
// //     }
    
// //     // Create temporary order in database with pending status
// //     const tempOrder = await Order.create({
// //       userId,
// //       items: items,
// //       address,
// //       amount: calculatedAmount,
// //       paymentType: "Stripe",
// //       isPaid: false,
// //       status: "Pending Payment"
// //     });
    
// //     const successUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-success`;
// //     const cancelUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/cart`;
    
// //     const session = await StripeService.createPaymentSession(
// //       lineItems,
// //       calculatedAmount,
// //       tempOrder._id.toString(),
// //       successUrl,
// //       cancelUrl
// //     );
    
// //     // Store session info
// //     req.session.pendingOrder = {
// //       userId,
// //       items,
// //       address,
// //       totalAmount: calculatedAmount,
// //       orderId: tempOrder._id,
// //       sessionId: session.id
// //     };
    
// //     res.status(200).json({
// //       success: true,
// //       sessionId: session.id,
// //       url: session.url
// //     });
// //   } catch (error) {
// //     console.error("Stripe Error:", error);
// //     res.status(500).json({
// //       success: false,
// //       message: error.message || "Payment creation failed"
// //     });
// //   }
// // };

// // export const capturePaypalPayment = async (req, res) => {
// //   try {
// //     const { sessionId } = req.body;
    
// //     const pendingOrder = req.session.pendingOrder;
// //     if (!pendingOrder || pendingOrder.sessionId !== sessionId) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Order not found or mismatch"
// //       });
// //     }
    
// //     const session = await StripeService.retrieveSession(sessionId);
    
// //     if (session.payment_status === 'paid') {
// //       // Deduct stock for each item
// //       for (const item of pendingOrder.items) {
// //         const product = await Product.findById(item.product);
// //         if (product) {
// //           product.stockQuantity -= item.quantity;
// //           if (product.stockQuantity === 0) {
// //             product.inStock = false;
// //           }
// //           await product.save();
// //         }
// //       }
      
// //       // Update order as paid
// //       await Order.findByIdAndUpdate(pendingOrder.orderId, {
// //         isPaid: true,
// //         status: "Payment Completed",
// //         stripeSessionId: sessionId
// //       });
      
// //       delete req.session.pendingOrder;
      
// //       return res.status(200).json({
// //         success: true,
// //         message: "Payment successful and order created"
// //       });
// //     } else {
// //       // Delete the pending order if payment failed
// //       await Order.findByIdAndDelete(pendingOrder.orderId);
      
// //       return res.status(400).json({
// //         success: false,
// //         message: "Payment not completed"
// //       });
// //     }
// //   } catch (error) {
// //     console.error("Payment Capture Error:", error);
// //     res.status(500).json({
// //       success: false,
// //       message: error.message || "Payment capture failed"
// //     });
// //   }
// // };














// import StripeService from '../helper/paypalService.js';
// import Order from '../models/order.model.js';
// import Product from '../models/product.model.js';

// export const createPaypalOrder = async (req, res) => {
//   try {
//     const userId = req.user;
//     const { items, address, totalAmount } = req.body;

//     if (!address || !items || items.length === 0) {
//       return res.status(400).json({
//         message: "Invalid order details",
//         success: false
//       });
//     }

//     const lineItems = [];
//     let calculatedAmount = totalAmount || 0;

//     for (const item of items) {
//       const product = await Product.findById(item.product);
//       if (!product) {
//         return res.status(404).json({
//           success: false,
//           message: `Product not found`
//         });
//       }

//       if (product.stockQuantity < item.quantity) {
//         return res.status(400).json({
//           success: false,
//           message: `Only ${product.stockQuantity} ${product.name} available in stock`
//         });
//       }

//       lineItems.push({
//         name: product.name,
//         price: product.offerPrice,
//         quantity: item.quantity,
//         productId: product._id
//       });

//       if (!totalAmount) {
//         calculatedAmount += product.offerPrice * item.quantity;
//       }
//     }

//     if (!totalAmount) {
//       calculatedAmount += calculatedAmount * 0.02;
//     }

//     // Create order in DB first, store sessionId after
//     const tempOrder = await Order.create({
//       userId,
//       items,
//       address,
//       amount: calculatedAmount,
//       paymentType: "Stripe",
//       isPaid: false,
//       status: "Pending Payment"
//     });

//     const successUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-success`;
//     const cancelUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/cart`;

//     const session = await StripeService.createPaymentSession(
//       lineItems,
//       calculatedAmount,
//       tempOrder._id.toString(),
//       successUrl,
//       cancelUrl
//     );

//     // Save sessionId to order — no req.session needed
//     await Order.findByIdAndUpdate(tempOrder._id, {
//       stripeSessionId: session.id
//     });

//     res.status(200).json({
//       success: true,
//       sessionId: session.id,
//       url: session.url
//     });
//   } catch (error) {
//     console.error("Stripe Error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message || "Payment creation failed"
//     });
//   }
// };

// export const capturePaypalPayment = async (req, res) => {
//   try {
//     const { sessionId } = req.body;

//     if (!sessionId) {
//       return res.status(400).json({
//         success: false,
//         message: "Session ID is required"
//       });
//     }

//     // Look up order by sessionId from DB — no req.session needed
//     const pendingOrder = await Order.findOne({ stripeSessionId: sessionId });

//     if (!pendingOrder) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found for this session"
//       });
//     }

//     const session = await StripeService.retrieveSession(sessionId);

//     if (session.payment_status === 'paid') {
//       // Deduct stock
//       for (const item of pendingOrder.items) {
//         const product = await Product.findById(item.product);
//         if (product) {
//           product.stockQuantity -= item.quantity;
//           if (product.stockQuantity === 0) {
//             product.inStock = false;
//           }
//           await product.save();
//         }
//       }

//       await Order.findByIdAndUpdate(pendingOrder._id, {
//         isPaid: true,
//         status: "Payment Completed"
//       });

//       return res.status(200).json({
//         success: true,
//         message: "Payment successful and order created"
//       });
//     } else {
//       await Order.findByIdAndDelete(pendingOrder._id);

//       return res.status(400).json({
//         success: false,
//         message: "Payment not completed"
//       });
//     }
//   } catch (error) {
//     console.error("Payment Capture Error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message || "Payment capture failed"
//     });
//   }
// };





























import StripeService from '../helper/paypalService.js';
import Order from '../models/order.model.js';
import Product from '../models/product.model.js';

export const createPaypalOrder = async (req, res) => {
  try {
    const userId = req.user;
    const { items, address, totalAmount } = req.body;

    if (!address || !items || items.length === 0) {
      return res.status(400).json({ message: "Invalid order details", success: false });
    }

    const lineItems = [];
    let calculatedAmount = totalAmount || 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found` });
      }

      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stockQuantity} ${product.name} available in stock`
        });
      }

      lineItems.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
        productId: product._id
      });

      if (!totalAmount) {
        calculatedAmount += product.offerPrice * item.quantity;
      }
    }

    if (!totalAmount) {
      calculatedAmount += calculatedAmount * 0.02;
    }

    const tempOrder = await Order.create({
      userId,
      items,
      address,
      amount: calculatedAmount,
      paymentType: "Stripe",
      isPaid: false,
      status: "Pending Payment"
    });

    const successUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-success`;
    const cancelUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/cart`;

    const session = await StripeService.createPaymentSession(
      lineItems,
      calculatedAmount,
      tempOrder._id.toString(),
      successUrl,
      cancelUrl
    );

    // Save sessionId to order
    await Order.findByIdAndUpdate(tempOrder._id, { stripeSessionId: session.id });

    res.status(200).json({ success: true, sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ success: false, message: error.message || "Payment creation failed" });
  }
};

export const capturePaypalPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: "Session ID is required" });
    }

    const pendingOrder = await Order.findOne({ stripeSessionId: sessionId });

    if (!pendingOrder) {
      return res.status(404).json({ success: false, message: "Order not found for this session" });
    }

    // Prevent double-processing
    if (pendingOrder.isPaid) {
      return res.status(200).json({ success: true, message: "Payment already processed" });
    }

    const session = await StripeService.retrieveSession(sessionId);

    if (session.payment_status === 'paid') {
      // Deduct stock for each item
      for (const item of pendingOrder.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stockQuantity -= item.quantity;
          if (product.stockQuantity <= 0) {
            product.stockQuantity = 0;
            product.inStock = false;
          }
          await product.save();
        }
      }

      await Order.findByIdAndUpdate(pendingOrder._id, {
        isPaid: true,
        status: "Payment Completed"
      });

      return res.status(200).json({ success: true, message: "Payment successful and order created" });
    } else {
      await Order.findByIdAndDelete(pendingOrder._id);
      return res.status(400).json({ success: false, message: "Payment not completed" });
    }
  } catch (error) {
    console.error("Payment Capture Error:", error);
    res.status(500).json({ success: false, message: error.message || "Payment capture failed" });
  }
};