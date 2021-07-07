let jwt = require("jsonwebtoken");
const User = require('../modules/user/models');
const Admin = require('../modules/admin/models');

let loginObj = {
    getUserInfo: (req, res, next) => {
        const id = req.params.id;
        const type = req.params.type;
        let obj = { "fname": 1 };
        if (type == "email") {
            obj.email = 1;
        } else {
            obj.phone = 1;
        }

        User.Auth.findById(id, obj, (err, data) => {
            if (err) {
                res.send(err.message);
            } else {
                console.log(data);
                req.data = data;
                next();
            }
        })
    },

    generateSecurityCode: () => {
        return Math.floor(Math.random() * 8999 + 1000);
    },

    // Check Username for User is Exist or Not. & Also Check User Status.
    // Params Or Object : Username
    checkExestingUser: (req, res, next) => {
        let obj = req.body;
        let conObj;
        if ('email' in obj) {
            conObj = { email: obj.email };
        }else{
            conObj = { username: obj.username };
        }
        User.Auth.findOne(conObj, (err, data) => {
            if (err) {
                res.send(err.message);
            } else {
                if (data) {
                    let emailMsg = "", userMsg = "";
                    if (data.username == obj.username) {
                        userMsg = "Username is Already Exist.";
                    }
                     else if (data.email == obj.email) {
                        emailMsg = "Email is Already Exist.";
                    }
                    res.send(emailMsg + " " + userMsg);
                } else {
                    next();
                }
            }
        })
    },

    // Check Username for User is Exist or Not. & Also Check User Status.
    // Params Or Object : Username
    checkExestingAdmin: (req, res, next) => {
        let obj = req.body;
        let conObj;
        if ('email' in obj) {
            conObj = { email: obj.email };
        }else{
            conObj = { phone: obj.phone };
        }
        Admin.Auth.findOne(conObj, (err, data) => {
            if (err) {
                res.send(err.message);
            } else {
                if (data) {
                    let emailMsg = "", userMsg = "";
                    if (data.email == obj.email) {
                        emailMsg = "Email is Already Exist.";
                    }
                    if (data.username == obj.username) {
                        userMsg = "Username is Already Exist.";
                    }
                    res.send(emailMsg + " " + userMsg);
                } else {
                    next();
                }
            }
        })
    },
    // Check Username for User is Exist or Not. & Also Check User Status.
    // Params Or Object : Username
    checkExestingUsername: (req, res, next) => {
        User.Auth.findOne({ username: req.body.username }, (err, data) => {
            if (err) {
                res.send(err.message);
            } else {
                if (data) {
                    let errorMsg = "";
                    if (data.username == req.body.username) {
                        errorMsg = "Username is already exist.";
                    }
                    res.send(errorMsg);
                } else {
                    next();
                }
            }
        })
    },
    compareTokenTimeOut: (req, res, next) => {
        // var token = req.headers['x-access-token'];
        let token = req.headers.authorization;
        if (!token) {
            res.status(401).send({ auth: false, message: 'No token provided.' })
        } else {
            jwt.verify(token, process.env.secrateKey, (err, decoded) => {
                if (err) {
                    res.status(500).json({ auth: false, message: 'Failed to authenticate token.' })
                } else {
                    // res.status(200).json(decoded);
                    // req.token = token;
                    next();
                }
            });
        }
    }
};

module.exports = loginObj;