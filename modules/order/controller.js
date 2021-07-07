const express = require("express");
const router = express.Router();
const Orders = require("./models");


router.get("/getAllOrders", (req, res) => {
  let query = req.body;
  Orders.find(query, (err, data) => {
    if (err) {
      res.status(400).json({
        type: "error",
        message: err.message,
      });
    } else {
      res.status(200).json({
        type: "Success",
        data: data,
      });
    }
  });
});

router.get("/getById/:id", (req, res) => {
  user_id = req.params.id;
  Orders.findById(user_id, (err, data) => {
    if (err) {
      res.status(400).json({
        type: "error",
        message: err.message,
      });
    } else {
      res.status(200).json({
        type: "Success",
        data: data,
      });
    }
  });
});

router.post("/addOrder", (req, res) => {
  model = Orders.orderInfo(req.body);
  model.save((err, data) => {
    if (err) {
      res.status(400).json({
        status: "error",
        message: err.message,
      });
    } else {
      res.status(200).json({
        status: "Success",
        data: data,
      });
    }
  });
});

router.get("/getByStatus/:id", (req, res) => {
  id = req.params.id;
  Orders.findById(id, (err, data) => {
    if (err) {
      res.status(400).json({
        status: "error",
        message: err.message,
      });
    } else {
      res.status(200).json({
        status: "Success",
        data: data,
      });
    }
  });
});

module.exports = router;
