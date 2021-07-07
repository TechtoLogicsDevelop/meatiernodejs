const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const objectId = Schema.ObjectId;

const vendor = {
  _id: { type: objectId, auto: true },
  storeName: String,
  contactPerson: String,
  username: String,
  password: String,
  location: String,
  email: String,
  countryCode: Number,
  phone: Number,
  products: {
    type: Schema.Types.ObjectId,
    ref: "product",
  },
  createdDate: Date,
  updatedDate: Date,
  status: { type: Boolean, default: 1 },
};

const vendorSchema = new Schema(vendor, { versionKey: false });

vendorSchema.pre("save", function (next) {
  const currentDate = new Date();
  this.updatedDate = currentDate;
  if (!this.createdDate) {
    console.log(currentDate);
    this.createdDate = currentDate;
  }
  next();
});

// Vendor Details
const vendorDetails = {
  _id: { type: objectId, auto: true },
  userId: { type: objectId, required: true },
  workingHours: String,
  address: String,
  location: String,
  city: String,
  state: String,
  country: String,
  pinCode: String,
  createdDate: Date,
  updatedDate: Date,
};
const vendorDetailsSchema = new Schema(vendorDetails, { versionKey: false });

vendorDetailsSchema.pre("save", function (next) {
  const currentDate = new Date();
  this.updatedDate = currentDate;
  if (!this.createdDate) {
    this.createdDate = currentDate;
  }
  next();
});

// Vendor Profile Pics
const vendorProfilePics = {
  _id: { type: objectId, auto: true },
  userId: { type: objectId, required: true },
  profilePics: String,
  createdDate: Date,
  updatedDate: Date,
};
const vendorProfilePicsSchema = new Schema(vendorProfilePics, {
  versionKey: false,
});

vendorProfilePicsSchema.pre("save", function (next) {
  const currentDate = new Date();
  this.updatedDate = currentDate;
  if (!this.createdDate) {
    this.createdDate = currentDate;
  }
  next();
});

module.exports = {
  Auth: mongoose.model("vendor", vendorSchema),
  Details: mongoose.model("vendorDetails", vendorDetailsSchema),
  ProfilePics: mongoose.model("vendorProfilePics", vendorProfilePicsSchema),
};
