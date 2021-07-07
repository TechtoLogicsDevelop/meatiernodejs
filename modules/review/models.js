const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const objectId = Schema.ObjectId;

const review = {
  _id: { type: objectId, auto: true },
  productId: { type: objectId, required: true },
  userId: { type: objectId, required: true },
  productType: { type: String, required: true },
  rating: { type: Number, required: true },
  reviewHeading: { type: String, required: true },
  review: { type: String, required: true },
  reviewImage: [String],
  reviewerName: { type: String, required: true },
  reviewerEmail: { type: String, required: true },
  reviewDate: Date,
  status: { type: Boolean, default: 1 },
};
const reviewSchema = new Schema(review, { versionKey: false });

reviewSchema.pre("save", function (next) {
  const currentDate = new Date();
  if (!this.reviewDate) {
    this.reviewDate = currentDate;
  }
  next();
});

// Feedback
const feedback = {
  _id: { type: objectId, auto: true },
  productId: { type: objectId, required: true },
  userId: { type: objectId, required: true },
  like: Number,
  share: Number,
  reviewerName: { type: String, required: true },
  reviewerEmail: { type: String, required: true },
  feedbackDate: Date,
};
const feedbackSchema = new Schema(feedback, { versionKey: false });

feedbackSchema.pre("save", function (next) {
  this.feedbackDate = new Date();
  next();
});

module.exports = {
  Comment: mongoose.model("review", reviewSchema),
  Feedback: mongoose.model("feedback", feedbackSchema),
};
