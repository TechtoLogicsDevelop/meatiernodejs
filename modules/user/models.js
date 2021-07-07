const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const objectId = Schema.ObjectId;

const user = {
  _id: { type: objectId, auto: true },
  username: String,
  password: String,
  email: String,
  phone: Number,
  createdDate: Date,
  updatedDate: Date,
  status: { type: Boolean, default: 1 },
};
const userSchema = new Schema(user, { versionKey: false });

userSchema.pre("save", function (next) {
  const currentDate = new Date();
  this.updatedDate = currentDate;
  if (!this.createdDate) {
    console.log(currentDate);
    this.createdDate = currentDate;
  }
  next();
});

// User Details
const userDetails = {
  _id: { type: objectId, auto: true },
  userId: { type: objectId, required: true },
  address: String,
  location: String,
  city: String,
  state: String,
  country: String,
  pinCode: String,
  Location: String,
  createdDate: Date,
  updatedDate: Date,
};
const userDetailsSchema = new Schema(userDetails, { versionKey: false });

userDetailsSchema.pre("save", function (next) {
  const currentDate = new Date();
  this.updatedDate = currentDate;
  if (!this.createdDate) {
    this.createdDate = currentDate;
  }
  next();
});

// User Profile Pics
const userProfilePics = {
  _id: { type: objectId, auto: true },
  userId: { type: objectId, required: true },
  profilePics: String,
  createdDate: Date,
  updatedDate: Date,
};
const userProfilePicsSchema = new Schema(userProfilePics, {
  versionKey: false,
});

userProfilePicsSchema.pre("save", function (next) {
  const currentDate = new Date();
  this.updatedDate = currentDate;
  if (!this.createdDate) {
    this.createdDate = currentDate;
  }
  next();
});

// User Profile Pics
const userLocation = {
  _id: { type: objectId, auto: true },
  userId: { type: objectId, required: true },
  currentLocation: { type: Object },
  createdDate: Date,
  updatedDate: Date,
};
const userLocationSchema = new Schema(userLocation, { versionKey: false });

userLocationSchema.pre("save", function (next) {
  const currentDate = new Date();
  this.updatedDate = currentDate;
  if (!this.createdDate) {
    this.createdDate = currentDate;
  }
  next();
});

module.exports = {
  Auth: mongoose.model("user", userSchema),
  Details: mongoose.model("userDetails", userDetailsSchema),
  ProfilePics: mongoose.model("userProfilePics", userProfilePicsSchema),
  Location: mongoose.model("location", userLocationSchema),
};
