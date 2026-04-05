// import mongoose from "mongoose";
// const orderSchema = new mongoose.Schema(
//   {
//     userId: { type: String, required: true, ref: "User" },
//     items: [
//       {
//         product: { type: String, required: true, ref: "Product" },
//         quantity: { type: Number, required: true },
//       },
//     ],
//     amount: { type: Number, required: true },
//     address: { type: String, required: true, ref: "Address" },
//     status: { type: String, default: "Order Placed" },
//     paymentType: { type: String, required: true },
//     isPaid: { type: Boolean, required: true, default: false },
//   },
//   { timestamps: true }
// );
// const Order = mongoose.model("Order", orderSchema);
// export default Order;






import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { 
      type: String, 
      required: true, 
      ref: "User" 
    },
    items: [
      {
        product: { 
          type: String, 
          required: true, 
          ref: "Product" 
        },
        quantity: { 
          type: Number, 
          required: true 
        },
      },
    ],
    amount: { 
      type: Number, 
      required: true 
    },
    address: { 
      type: String, 
      required: true, 
      ref: "Address" 
    },
    status: { 
      type: String, 
      default: "Order Placed",
      enum: ["Order Placed", "Processing", "Shipped", "Delivered", "Cancelled"] // Add enum validation
    },
    paymentType: { 
      type: String, 
      required: true,
      enum: ["COD", "PayPal", "Card"] // Optional: add enum for payment types
    },
    isPaid: { 
      type: Boolean, 
      required: true, 
      default: false 
    },
    paypalOrderId: { // Add this if you want to store PayPal order ID
      type: String,
      sparse: true // Allows multiple documents without this field
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;