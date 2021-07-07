const express = require("express");
const Review = require("./models");
const router = express.Router();

router.get("/allReview/:productId", (req, res) => {
  const productId = req.params.productId;
  Review.Comment.find({ productId: productId }, (err, data) => {
    if (err) {
      res.send(err.message);
    } else {
      res.json(data);
    }
  });
});

router.post("/addReview", (req, res) => {
  let model = new Review.Comment(req.body);
  model.save((err, data) => {
    if (err) {
      res.send(err.message);
    } else {
      res.json({
        success: true,
        message: "Review inserted for product",
      });
    }
  });
});

router.get("/getFeedback/:productId", (req, res) => {
  const productId = req.params.productId;
  Review.Feedback.find({ productId: productId }, (err, data) => {
    if (err) {
      res.send(err.message);
    } else {
      res.json(data);
    }
  });
});
router.post("/addFeedback", (req, res) => {
  let model = new Review.Feedback(req.body);
  model.save((err, data) => {
    if (err) {
      res.send(err.message);
    } else {
      res.json({
        success: true,
        message: "Review inserted for product",
      });
    }
  });
});

module.exports = router;
