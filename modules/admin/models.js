const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const objectId = Schema.ObjectId;

const user = {
  _id: { type: objectId, auto: true },
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  role: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  countryCode: { type: Number, required: true },
  phone: { type: Number, required: true },
  emailVerified: { type: Boolean, default: 0 },
  phoneVerified: { type: Boolean, default: 0 },
  org: { type: String, required: true },
  securityCode: Number,
  createdDate: Date,
  updatedDate: Date,
  status: { type: Boolean, default: 1 },
};
const userSchema = new Schema(user, { versionKey: false });

userSchema.pre("save", function (next) {
  const currentDate = new Date();
  this.updatedDate = currentDate;
  if (!this.createdDate) {
    this.createdDate = currentDate;
  }
  next();
});

userSchema.pre("findOneAndUpdate", function (next) {
  this.updatedDate = new Date();
  next();
});

// User Details
const userDetails = {
  _id: { type: objectId, auto: true },
  userId: { type: objectId, required: true },
  city: String,
  state: String,
  country: String,
  pinCode: String,
  region: String,
  timezone: String,
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
userDetailsSchema.pre("findOneAndUpdate", function (next) {
  console.log("Pre User DetailsSchema Update");
  this.updatedDate = new Date();
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
userProfilePicsSchema.pre("findOneAndUpdate", function (next) {
  console.log("Pre User Profile Pics Schema Update");
  this.updatedDate = new Date();
  next();
});

module.exports = {
  Auth: mongoose.model("admin", userSchema),
  Details: mongoose.model("adminDetails", userDetailsSchema),
  ProfilePics: mongoose.model("adminProfilePics", userProfilePicsSchema),
};
