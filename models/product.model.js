// // import mongoose from "mongoose";
// // const productSchema = new mongoose.Schema({
// //   name: {
// //     type: String,
// //     required: true,
// //   },
// //   description: {
// //     type: Array,
// //     required: true,
// //   },
// //   price: {
// //     type: Number,
// //     required: true,
// //   },
// //   offerPrice: {
// //     type: Number,
// //     required: true,
// //   },
// //   image: {
// //     type: Array,
// //     required: true,
// //   },
// //   category: {
// //     type: String,
// //     required: true,
// //   },
// //   inStock: {
// //     type: Boolean,
// //     required: true,
// //     default: true,
// //   },
// // });

// // const Product = mongoose.model("Product", productSchema);
// // export default Product;


// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String, // Changed from Array to String
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   offerPrice: {
//     type: Number,
//     required: true,
//   },
//   image: {
//     type: Array,
//     required: true,
//   },
//   category: {
//     type: String,
//     required: true,
//   },
//   inStock: {
//     type: Boolean,
//     required: true,
//     default: true,
//   },
//   stockQuantity: { // Added this field
//     type: Number,
//     required: true,
//     default: 0,
//   },
// },
// { timestamps: true });

// const Product = mongoose.model("Product", productSchema);
// export default Product;






















import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    inStock: { type: Boolean, required: true, default: true },
    stockQuantity: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;