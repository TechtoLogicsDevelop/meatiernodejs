const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please include the product name"],
  },
  price: {
    type: String,
    required: [true, "Please include the product price"],
  },
  category: {
    type: String,
    required: [true, "Please include the Category"],
  },
  subCategory: {
    type: String,
    required: [true, "Please include the subCategory"]
  },
  group: {
    type: String,
    required: [true, "Please include the group"]
  },
  subGroup: {
    type: String,
    required: [true, "Please include the Sub group"]
  },
  stock: {
    type: Number,
    required: [true, "Please Enter the available stock"]
  }
//  image: {
//     type: String,
//     required: true,
//   },
});
const Product = mongoose.model("product", productSchema);
module.exports = Product;