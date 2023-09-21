const express = require("express");

const router = express.Router();

const UserModel = require("../model/UserModel")
const InvalidTokenModel = require("../model/InvalidTokenModel");
const bcrypt = require("bcryptjs")

const webToken = require("jsonwebtoken")

require("dotenv").config()

//////Register API ================================================================================================

router.post("/register", (req, res) => {
    const { id, name, password, usertype } = req.body;
    if (id == undefined || id == '' ||
        password == undefined || name == undefined ||
        name == '' || password == '' ||
        usertype == undefined || usertype == '') {
        res.status(401).json({
            message: "Fill All Fields",
            status: res.statusCode
        })

    }
    else {
        UserModel.findOne({
            attributes: ["id"],
            where: {
                id
            }
        }).then((value) => {
            if (value == null) {
                //useerid does not exists prior
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(password, salt, (err, hash) => {
                        //create record
                        UserModel.create({
                            id: id,
                            name: name,
                            usertype: usertype,
                            password: hash

                        }).then((value) => {

                            res.status(201).json({
                                message: "Account created Successfully",
                                status: res.statusCode
                            })
                        }).catch(err => res.status(404).json({
                            message: "Something went WRONG!"
                        }))
                    })
                })
            }
            else {
                res.status(401).json({
                    message: "User ID Already Exists",
                    status: res.statusCode
                })
            }
        })
    }
})


//// LOGIN API
router.post("/login", (req, res) => {
    const { id, password } = req.body;
    if (id == undefined || id == '' ||
        password == undefined || password == '') {
        res.status(401).json({
            message: "Fill All Fields",
            status: res.statusCode
        });
    } else {
        UserModel.findOne({
            where: {
                id
            }
        }).then((value) => {
            if (value == null) {
                // User ID does not exist, ask for a valid ID
                res.status(401).json({
                    message: "No Such ID Found. Please enter a correct ID or register.",
                    status: res.statusCode,
                    token: "",
                    usertype: "",
                    name: ""
                });
            } else {
                // If ID is present
                const dbUserPassword = value.getDataValue("password");

                bcrypt.compare(password, dbUserPassword, function (err, result) {
                    if (result) {
                        // Correct password, then send a web token
                        const userdetail = {
                            name: value.getDataValue("name"),
                            id: value.getDataValue("id"),
                        };
                        const token = webToken.sign(userdetail, process.env.secret_key);
                        res.status(201).json({
                            message: "Logged In",
                            status: res.statusCode,
                            token: token,
                            userData: userdetail
                        });
                    } else {
                        // Incorrect Password
                        res.status(401).json({
                            message: "Invalid Password",
                            status: res.statusCode,
                            token: "",
                            userData: ''
                        });
                    }
                });
            }
        });
    }
});



////get USER PROFILE API ================================================================================================

router.get("/profile", (req, res) => {
    const authHeader = req.headers["authorization"];
    if (authHeader) {
        // const token = authHeader.substr("Bearer".length);
        const token = authHeader.split("Bearer ")[1];
        webToken.verify(token, process.env.secret_key, (err, user) => {
            if (err) {
                console.error(err); // Add this line to log any errors
                // Handle the error
            }
            if (user) {
                res.status(200).json({
                    message: "Success",
                    status: res.statusCode,
                    data: user
                })
            }
            else {
                res.status(401).json({
                    message: "PLease Login",
                    status: res.statusCode,
                })
            }
        })
    }
})



////Logout API ================================================================================================
router.post("/logout", (req, res) => {
    const authHeader = req.headers["authorization"];
    if (authHeader) {
        const token = authHeader.split("Bearer ")[1];
        InvalidTokenModel.findOne({
            where: {
                id: token
            }
        }).then((value) => {
            if (value != null) {
                return res.status(401).json({
                    message: "Invalid Token",
                    status: res.statusCode
                });
            }
            else{
        InvalidTokenModel.create({
            id: token
        })
            .then(() => {
                res.status(200).json({
                    message: "Logged Out Successfully",
                    status: res.statusCode,
                });
            })}})
    }
    else {
        res.status(401).json({
            message: "Unauthorized",
            status: res.statusCode,
        });
    }
});



module.exports = router