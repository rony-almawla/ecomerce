const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: String, index: true },
  stock: { type: Number, default: 0 },
  images: [String],
}, { timestamps: true });

// module.exports = mongoose.model('Product', ProductSchema);

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;