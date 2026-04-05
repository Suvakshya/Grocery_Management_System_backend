// // import Product from "../models/product.model.js";

// // // add product :/api/product/add
// // export const addProduct = async (req, res) => {
// //   try {
// //     const { name, price, offerPrice, description, category } = req.body;
// //     // const image = req.files?.map((file) => `/uploads/${file.filename}`);
// //     const image = req.files?.map((file) => file.filename);
// //     if (
// //       !name ||
// //       !price ||
// //       !offerPrice ||
// //       !description ||
// //       !category ||
// //       !image ||
// //       image.length === 0
// //     ) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "All fields including images are required",
// //       });
// //     }

// //     const product = new Product({
// //       name,
// //       price,
// //       offerPrice,
// //       description,
// //       category,
// //       image,
// //     });

// //     const savedProduct = await product.save();

// //     return res.status(201).json({
// //       success: true,
// //       product: savedProduct,
// //       message: "Product added successfully",
// //     });
// //   } catch (error) {
// //     console.error("Error in addProduct:", error);

// //     return res
// //       .status(500)
// //       .json({ success: false, message: "Server error while adding product" });
// //   }
// // };

// // // get products :/api/product/get
// // export const getProducts = async (req, res) => {
// //   try {
// //     const products = await Product.find({});
// //     res.status(200).json({ success: true, products });
// //   } catch (error) {
// //     res.status(500).json({ message: "Server error", error: error.message });
// //   }
// // };
// // // get single product :/api/product/id
// // export const getProductById = async (req, res) => {
// //   try {
// //     const { id } = req.body;
// //     const product = await Product.findById(id);
// //     res.status(200).json({ success: true, product });
// //   } catch (error) {
// //     res.status(500).json({ message: "Server error", error: error.message });
// //   }
// // };
// // // change stock  :/api/product/stock
// // export const changeStock = async (req, res) => {
// //   try {
// //     const { id, inStock } = req.body;
// //     const product = await Product.findByIdAndUpdate(
// //       id,
// //       { inStock },
// //       { new: true }
// //     );
// //     res
// //       .status(200)
// //       .json({ success: true, product, message: "Stock updated successfully" });
// //   } catch (error) {
// //     res.status(500).json({ message: "Server error", error: error.message });
// //   }
// // };
// import Product from "../models/product.model.js";

// // add product :/api/product/add-product
// export const addProduct = async (req, res) => {
//   try {
//     const { name, price, offerPrice, description, category, stockQuantity } = req.body;
//     const image = req.files?.map((file) => file.filename);
    
//     if (
//       !name ||
//       !price ||
//       !offerPrice ||
//       !description ||
//       !category ||
//       !stockQuantity ||
//       !image ||
//       image.length === 0
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields including images are required",
//       });
//     }

//     const product = new Product({
//       name,
//       price,
//       offerPrice,
//       description,
//       category,
//       stockQuantity: parseInt(stockQuantity),
//       image,
//     });

//     const savedProduct = await product.save();

//     return res.status(201).json({
//       success: true,
//       product: savedProduct,
//       message: "Product added successfully",
//     });
//   } catch (error) {
//     console.error("Error in addProduct:", error);

//     return res
//       .status(500)
//       .json({ success: false, message: "Server error while adding product" });
//   }
// };

// // get products :/api/product/get
// export const getProducts = async (req, res) => {
//   try {
//     const products = await Product.find({});
//     res.status(200).json({ success: true, products });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // get single product :/api/product/id
// export const getProductById = async (req, res) => {
//   try {
//     const { id } = req.params; // Changed from req.body to req.params
//     const product = await Product.findById(id);
//     res.status(200).json({ success: true, product });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // change stock status :/api/product/stock
// export const changeStock = async (req, res) => {
//   try {
//     const { id, inStock } = req.body;
//     const product = await Product.findByIdAndUpdate(
//       id,
//       { inStock },
//       { new: true }
//     );
//     res
//       .status(200)
//       .json({ success: true, product, message: "Stock status updated successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // update stock quantity :/api/product/stock-quantity
// export const updateStockQuantity = async (req, res) => {
//   try {
//     const { id, stockQuantity } = req.body;
    
//     if (stockQuantity === undefined || stockQuantity === null) {
//       return res.status(400).json({
//         success: false,
//         message: "Stock quantity is required",
//       });
//     }

//     const product = await Product.findByIdAndUpdate(
//       id,
//       { stockQuantity: parseInt(stockQuantity) },
//       { new: true }
//     );
    
//     res
//       .status(200)
//       .json({ success: true, product, message: "Stock quantity updated successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

import Product from "../models/product.model.js";
import fs from 'fs';
import path from 'path';

// export const addProduct = async (req, res) => {
//   try {
//     const { name, price, offerPrice, description, category, stockQuantity } = req.body;
//     const image = req.files?.map((file) => file.filename);
    
//     if (!name || !price || !offerPrice || !description || !category || !stockQuantity || !image || image.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields including images are required",
//       });
//     }

//     const product = new Product({
//       name,
//       price,
//       offerPrice,
//       description,
//       category,
//       stockQuantity: parseInt(stockQuantity),
//       image,
//     });

//     const savedProduct = await product.save();

//     return res.status(201).json({
//       success: true,
//       product: savedProduct,
//       message: "Product added successfully",
//     });
//   } catch (error) {
//     console.error("Error in addProduct:", error);
//     return res.status(500).json({ success: false, message: "Server error while adding product" });
//   }
// };


export const addProduct = async (req, res) => {
  try {
    const { name, price, offerPrice, description, category, stockQuantity } = req.body;
    const image = req.files?.map((file) => file.filename);
    
    if (!name || !price || !offerPrice || !description || !category || !stockQuantity || !image || image.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All fields including images are required",
      });
    }

    const product = new Product({
      name,
      price,
      offerPrice,
      description,
      category,
      stockQuantity: parseInt(stockQuantity),
      image,
    });

    const savedProduct = await product.save();

    return res.status(201).json({
      success: true,
      product: savedProduct,
      message: "Product added successfully",
      recommendationUpdate: true
    });
  } catch (error) {
    console.error("Error in addProduct:", error);
    return res.status(500).json({ success: false, message: "Server error while adding product" });
  }
};


export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    const product = await Product.findByIdAndUpdate(id, { inStock }, { new: true });
    res.status(200).json({ success: true, product, message: "Stock status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateStockQuantity = async (req, res) => {
  try {
    const { id, stockQuantity } = req.body;
    
    if (stockQuantity === undefined || stockQuantity === null) {
      return res.status(400).json({
        success: false,
        message: "Stock quantity is required",
      });
    }

    const product = await Product.findByIdAndUpdate(id, { stockQuantity: parseInt(stockQuantity) }, { new: true });
    
    res.status(200).json({ success: true, product, message: "Stock quantity updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.image && product.image.length > 0) {
      const uploadsDir = path.join(process.cwd(), 'uploads');
      product.image.forEach((filename) => {
        const imagePath = path.join(uploadsDir, filename);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    res.status(500).json({ success: false, message: "Server error while deleting product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, offerPrice, description, category, stockQuantity } = req.body;
    const newImages = req.files?.map((file) => file.filename);

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (price) updateData.price = parseFloat(price);
    if (offerPrice) updateData.offerPrice = parseFloat(offerPrice);
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (stockQuantity) updateData.stockQuantity = parseInt(stockQuantity);

    if (newImages && newImages.length > 0) {
      const uploadsDir = path.join(process.cwd(), 'uploads');
      existingProduct.image.forEach((filename) => {
        const imagePath = path.join(uploadsDir, filename);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
      updateData.image = newImages;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    return res.status(200).json({
      success: true,
      product: updatedProduct,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Error in updateProduct:", error);
    return res.status(500).json({ success: false, message: "Server error while updating product" });
  }
};
