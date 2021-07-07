const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const multer = require("multer");
const User = require("./models");
const userMiddleware = require("../../middleware/user");
const email = require("../../middleware/email");
const uploadMiddleware = require("../../middleware/uploadImage");
const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const smsKey = process.env.SMS_SECRET_KEY;

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
let refreshTokens = [];
// Get All User Information. This is Only for Admin User
router.get("/info/:id", (req, res) => {
  const id = req.params.id;
  User.Auth.findById(id, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      let obj = {
        fname: data.fname,
        lname: data.lname,
        role: data.role,
        username: data.username,
        email: data.email,
        countryCode: 91,
        phone: `+${data.countryCode}-${data.phone}`,
        emailVerified: data.emailVerified,
        phoneVerified: data.phoneVerified,
      };
      res.send(obj);
    }
  });
});

router.post("/login", (req, res) => {
  let obj = req.body;
  // obj.password = jwt.sign(obj.password, 'ssshhhhh');
  obj.status = true;
  User.Auth.findOne(obj, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      if (data == null) {
        res.status(401).json({ error: "Username & password is not Valid" });
      } else {
        console.log("Logged in Successfully");
        let obj = {
          username: data.username,
          email: data.email,
          role: data.role,
        };
        let token = jwt.sign(obj, process.env.SECRET_KEY, {
          expiresIn: 1800, // expires in 30 minuites
        });

        res.json({
          id: data._id,
          username: data.username,
          fname: data.fname,
          role: data.role,
          token: token,
        });
      }
    }
  });
});

router.put("/addUserInfo/:id", (req, res) => {
  let id = req.params.id;
  User.Auth.findOneAndUpdate({ _id: id }, req.body, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.json(data);
    }
  });
});

router.post("/forgotPassword", (req, res) => {
  User.Auth.findOne(req.body, (err, user) => {
    if (err) {
      res.send(err);
    } else {
      if (!user) {
        res.status(404).send("No User Found");
      } else {
        const url = "localhost:3000/user/forgotpassword?id=" + user.id;
        const resetUrlText =
          "Reset url is <a href='" + url + "'>" + url + "</a>";
        const resetUrlTemplate =
          "Reset url is <a href='" + url + "'>" + url + "</a>";

        email(user.email, "Reset Url", resetUrlTemplate, resetUrlText).then(
          (data) => {
            res.send(data);
          },
          (err) => {
            res.send(err);
          }
        );
      }
    }
  });
});

//Change Password
router.post("/changePassword", (req, res) => {
  const userId = req.body.id;
  const password = req.body.password;

  User.Auth.findById(userId, (err, user) => {
    if (err) {
      res.json({
        error: err,
        message: "Id is not correct",
      });
    } else {
      if (user == null) {
        res.status(404).send("User id not found");
      } else {
        User.Auth.findOneAndUpdate(
          { _id: userId },
          { password: password },
          (err, data) => {
            if (err) {
              res.send(err);
            } else {
              res.send("Password updated succesfully");
            }
          }
        );
      }
    }
  });
});

//Update Password
router.put("/updatePassword", (req, res) => {
  const userId = req.body.id;
  const password = req.body.password;
  const confirmPassword = req.body.confirmpassword;

  User.Auth.findById(userId, (err, user) => {
    if (err) {
      res.json({
        error: err,
        message: "Id is not correct",
      });
    } else {
      if (user == null) {
        res.status(404).send("User id not found");
      }
      if (password !== confirmPassword) {
        res.status(404).send("Password didn't Matched");
      } else {
        User.Auth.findOneAndUpdate(
          { _id: userId },
          { password: password },
          (err, data) => {
            if (err) {
              res.send(err);
            } else {
              res.send("Password updated succesfully");
            }
          }
        );
      }
    }
  });
});

/**
 * Insert User Details
 *  */
// Insert Logged in User Details
router.post("/insertUserDetails", (req, res) => {
  let obj = req.body;
  let model = new User(obj);
  model.save((err, user) => {
    if (err) {
      res.send(err);
    } else {
      res.send("User Data Inserted");
    }
  });
});

router.post(
  "/uploadProfilePics/:id",
  upload.single("profile"),
  uploadMiddleware.uploadImage,
  (req, res) => {
    let obj = {
      userId: req.params.id,
      profilePics: req.file.originalname,
    };
    let model = new user.ProfilePics(obj);
    model.save((err, profile) => {
      if (err) {
        res.send(err);
      } else {
        res.json("Profile picture uploaded successfully");
      }
    });
  }
);

router.post("/sendOTP", (req, res) => {
  const phone = req.body.phone;
  const otp = Math.floor(100000 + Math.random() * 900000);
  const ttl = 2 * 60 * 1000;
  const expires = Date.now() + ttl;
  const data = `${phone}.${otp}.${expires}`;
  const hash = crypto.createHmac("sha256", smsKey).update(data).digest("hex");
  const fullHash = `${hash}.${expires}`;

  client.messages
    .create({
      body: `Your One Time Login Password For Meatier is ${otp}`,
      from: "+14353835348",
      to: phone,
    })
    .then((messages) => console.log(messages))
    .catch((err) => console.error(err));

  res.status(200).send({ phone, hash: fullHash, otp }); // this bypass otp via api only for development instead hitting twilio api all the time
  // res.status(200).send({ phone, hash: fullHash });
});

router.post("/verifyOTP", (req, res) => {
  const phone = req.body.phone;
  const hash = req.body.hash;
  const otp = req.body.otp;
  let [hashValue, expires] = hash.split(".");

  let now = Date.now();
  if (now > parseInt(expires)) {
    return res.status(504).send({ msg: "Timeout. Please try again" });
  }
  let data = `${phone}.${otp}.${expires}`;
  let newCalculatedHash = crypto
    .createHmac("sha256", smsKey)
    .update(data)
    .digest("hex");
  if (newCalculatedHash === hashValue) {
    console.log("user confirmed");
    let obj = {
      userId: req.body.phone,
    };
    let model = new User.Auth(obj);
    model.save((err, profile) => {
      if (err) {
        res.send(err);
      } else {
        res.json("Profile picture uploaded successfully");
      }
    });
    const accessToken = jwt.sign({ data: phone }, process.env.JWT_AUTH_TOKEN, {
      expiresIn: "30s",
    });
    const refreshToken = jwt.sign(
      { data: phone },
      process.env.JWT_REFRESH_TOKEN,
      { expiresIn: "1y" }
    );
    refreshTokens.push(refreshToken);
    res
      .status(202)
      .cookie("accessToken", accessToken, {
        expires: new Date(new Date().getTime() + 30 * 1000),
        sameSite: "strict",
        httpOnly: true,
      })
      .cookie("refreshToken", refreshToken, {
        expires: new Date(new Date().getTime() + 31557600000),
        sameSite: "strict",
        httpOnly: true,
      })
      .cookie("authSession", true, {
        expires: new Date(new Date().getTime() + 30 * 1000),
        sameSite: "strict",
      })
      .cookie("refreshTokenID", true, {
        expires: new Date(new Date().getTime() + 31557600000),
        sameSite: "strict",
      })
      .send({ msg: "Device verified" });
  } else {
    console.log("not authenticated");
    return res.status(400).send({ verification: false, msg: "Incorrect OTP" });
  }
});

module.exports = router;
