const express = require("express");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const Admin = require("./models");
const Vendor = require("../vendors/models");
const email = require("../../middleware/email");
const userMiddleware = require("../../middleware/user");
const uploadMiddleware = require("../../middleware/uploadImage");

const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const smsKey = process.env.SMS_SECRET_KEY;

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// This is Only for Admin User
router.get("/info/:id", (req, res) => {
  const id = req.params.id;
  Admin.Auth.findById(id, (err, data) => {
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
/**

 */
router.post("/login", (req, res) => {
  let obj = {};
  obj.email = req.body.email;
  obj.password = req.body.password;
  // obj.password = jwt.sign(obj.password, 'ssshhhhh');
  obj.status = true;
  obj.role = "Admin";

  Admin.Auth.findOne(obj, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      if (data == null) {
        res.status(401).json({ error: "Username & password is not Valid" });
      } else {
        console.log(data);
        let obj = {
          username: data.username,
          email: data.email,
          role: data.role,
        };
        let token = jwt.sign(obj, process.env.SECRET_KEY, {
          expiresIn: 1800, // expires in 30 minuit
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

// Create New User

router.post("/signup", userMiddleware.checkExestingAdmin, (req, res) => {
  let obj = req.body;
  let model = new Admin.Auth(obj);
  // model.password = jwt.sign(obj.password, 'shhhhh');
  model.save((err, user) => {
    if (err) {
      res.send(err.message);
    } else {
      // let decoded = jwt.verify(user.password, 'shhhhh');
      let obj = { username: user.username, email: user.email, role: user.role };
      let token = jwt.sign(obj, process.env.SECRET_KEY, {
        expiresIn: 1800, // expires in 30 minuit
      });

      res.json({
        id: user._id,
        username: user.username,
        fname: user.fname,
        role: user.role,
        token: token,
      });
    }
  });
});

router.post("/forgotPassword", (req, res) => {
  Admin.Auth.findOne(req.body, (err, user) => {
    if (err) {
      res.send(err);
    } else {
      if (!user) {
        res.status(404).send("No User Found");
      } else {
        const url = "localhost:3000/admin/forgotpassword?id=" + user.id;
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
router.post("/changePassword", async (req, res) => {
  const id = req.body.id;
  const pass = req.body.password;

  Admin.Auth.findById(id, (err, user) => {
    if (err) {
      res.json({
        error: err,
        message: "Id is not correct",
      });
    } else {
      if (user == null) {
        res.status(404).send("No User Found");
      } else {
        Admin.Auth.findOneAndUpdate(
          { _id: id },
          { password: pass },
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

// Active Previous Deactivated User. & Deactivate Active User.
router.put("/activeDeactivateUser/:id", (req, res) => {
  let id = req.params.id;
  let status = req.body;
  Vendor.Auth.findById(id, (err, user) => {
    if (err) {
      res.json({
        error: err,
        message: "Id is not correct",
      });
    } else {
      if (user == null) {
        res.status(404).send("User id not found");
      } else {
        Vendor.Auth.findOneAndUpdate({ _id: id }, status, (err, data) => {
          if (err) {
            res.send(err);
          } else {
            if (req.body.status == false) {
              res.status(200).json({
                status: "succes",
                data: "User is Deactivated",
              });
            }
            {
              email(
                user.email,
                "Login Details",
                "<h1>Your Login Credentials are email: " +
                  user.email +
                  " password is: " +
                  user.password +
                  "</h1>",
                "Thank for your Registration"
              ).then(
                (data) => {
                  res.send(data);
                },
                (err) => {
                  res.send(err);
                }
              );
            }

            client.messages
              .create({
                body: `Your Email is ${user.email} and Password For Meatier is ${user.password}`,
                from: "+14353835348",
                to: "+919663968106",
              })
              .then((messages) => console.log(messages))
              .catch((err) => console.error(err));
          }
        });
      }
    }
  });
});

/**
 * Varify Phone
 *  */
router.get(
  "/generateVarificationCode/:type/:id",
  userMiddleware.getUserInfo,
  (req, res) => {
    const type = req.params.type; // For Mail & Send Message
    const id = req.params.id;
    const securityCode = userMiddleware.generateSecurityCode();
    const securityCodeText = "Varification Code is " + securityCode;
    const securityCodeTemplate =
      "<h1>Email varification code is " + securityCode + "</h1>";
    Admin.Auth.findOneAndUpdate(
      { _id: id },
      { securityCode: securityCode },
      (err, data) => {
        if (err) {
          res.send(err);
        } else {
          // For Mail & Send Message
          if (type == "email") {
            email(
              user.email,
              "Security Code",
              securityCodeTemplate,
              securityCodeText
            ).then(
              (data) => {
                res.send(data);
              },
              (err) => {
                console.log(err);
                res.send(err);
              }
            );
          } else {
            res.send(securityCode);
          }
        }
      }
    );
  }
);

router.put("/varification/:type/:id", (req, res) => {
  const obj = {};
  const id = req.params.id;
  const type = req.params.type;
  const securityCode = req.body.securityCode;

  if (type == "email") {
    obj.emailVerified = 1;
  } else {
    obj.phoneVerified = 1;
  }

  Admin.Auth.findById(id, { securityCode: 1 }, (err, code) => {
    if (err) {
      res.send(err);
    } else {
      if (code.securityCode == securityCode) {
        Admin.Auth.findOneAndUpdate({ _id: id }, obj, (err, data) => {
          if (err) {
            res.send(err);
          } else {
            res.send(`Admin's ${type} has varified`);
          }
        });
      } else {
        res.send(
          `Admin's ${type} has not varified. Because you have entered wrong Security Code`
        );
      }
    }
  });
});

/**
 * Insert Admin Details
 *  */
// Insert Logged in Admin Details
router.post("/insertUserDetails", (req, res) => {
  let obj = req.body;
  let model = new Admin.Details(obj);
  model.save((err, user) => {
    if (err) {
      res.send(err);
    } else {
      res.send("Admin data inserted");
    }
  });
});

// Get Logged in Admin Details
router.get("/userDetails/:id", (req, res) => {
  let id = req.params.id;
  Admin.Details.findOne({ userId: id }, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});

router.post(
  "/uploadProfilePics/:id",
  upload.single("profile"),
  uploadMiddleware.uploadImage,
  (req, res) => {
    let obj = {
      userId: req.body.id,
      profilePics: req.file.originalname,
    };
    let model = new Admin.ProfilePics(obj);
    model.save((err, profile) => {
      if (err) {
        res.send(err);
      } else {
        res.json("Profile picture uploaded successfully");
      }
    });
  }
);

module.exports = router;
