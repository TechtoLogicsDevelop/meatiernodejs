const express = require("express");
const cartRepository = require("./helper");
const productRepository = require("../product/helper");
const Cart = require("./models");
const router = express.Router();

router.post("/addToCart", async (req, res) => {
  const { productId } = req.body;
  const quantity = Number.parseInt(req.body.quantity);
  try {
    let cart = await cartRepository.cart();
    let productDetails = await productRepository.productById(productId);
    if (!productDetails) {
      return res.status(500).json({
        type: "Not Found",
        message: "Invalid request",
      });
    }
    //If Cart Exists 
    if (cart) {
      // Check if index exists 
      const indexFound = cart.items.findIndex(
        (item) => item.productId.id == productId
      );

      if (indexFound !== -1 && quantity <= 0) {
        cart.items.splice(indexFound, 1);
        if (cart.items.length == 0) {
          cart.subTotal = 0;
        } else {
          cart.subTotal = cart.items
            .map((item) => item.total)
            .reduce((acc, next) => acc + next);
        }
      }

      //Check if product exist
      else if (indexFound !== -1) {
        cart.items[indexFound].quantity =
          cart.items[indexFound].quantity + quantity;
        cart.items[indexFound].total =
          cart.items[indexFound].quantity * productDetails.price;
        cart.items[indexFound].price = productDetails.price;
        cart.subTotal = cart.items
          .map((item) => item.total)
          .reduce((acc, next) => acc + next);
      }

      //Check if quantity is greater than 0 then add item to items array 
      else if (quantity > 0) {
        cart.items.push({
          productId: productId,
          quantity: quantity,
          price: productDetails.price,
          total: parseInt(productDetails.price * quantity),
        });
        cart.subTotal = cart.items
          .map((item) => item.total)
          .reduce((acc, next) => acc + next);
      }
      //If quantity of price is 0 throw the error
      else {
        return res.status(400).json({
          type: "Invalid",
          message: "Invalid request",
        });
      }
      let data = await cart.save();
      res.status(200).json({
        type: "success",
        mgs: "Process successful",
        data: data,
      });
    }

    // This creates a new cart 
    else {
      const cartData = {
        items: [
          {
            productId: productId,
            quantity: quantity,
            total: parseInt(productDetails.price * quantity),
            price: productDetails.price,
          },
        ],
        subTotal: parseInt(productDetails.price * quantity),
      };
      cart = await cartRepository.addItem(cartData);
      let data = await cart.save();
      res.json(cart);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      type: "Invalid",
      message: "Something went wrong",
      err: err,
    });
  }
});

router.get("/getCartById/:id", (req, res) => {
  let query = req.params.id;
  Cart.findById(query, (err, data) => {
    if (err) {
      res.status(400).json({
        status: "Error",
        message: err.message,
      });
    } else {
      res.status(200).json({
        status: "Success",
        message: data,
      });
    }
  });
});

router.get("/getCart", async (req, res) => {
  try {
    let cart = await cartRepository.cart();
    if (!cart) {
      return res.status(400).json({
        type: "Invalid",
        message: "Cart not Found",
      });
    }
    res.status(200).json({
      status: true,
      data: cart,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      type: "Invalid",
      message: "Something went wrong",
      err: err,
    });
  }
});

router.delete("/emptyCart", async (req, res) => {
  try {
    let cart = await cartRepository.cart();
    cart.items = [];
    cart.subTotal = 0;
    let data = await cart.save();
    res.status(200).json({
      type: "success",
      mgs: "Cart has been emptied",
      data: data,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      type: "Error",
      message: err.message,
    });
  }
});

module.exports = router;
