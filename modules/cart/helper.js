const Cart = require("./models");
exports.cart = () => {
  const carts = Cart.find().populate({
    path: "items.productId",
    select: "name price total",
  });
  return carts[0];
};
exports.addItem = (payload) => {
  const newItem = Cart.create(payload);
  return newItem;
};
