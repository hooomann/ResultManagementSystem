const express = require("express");
const router = express.Router();
const ResultModel = require("../model/ResultModel");
const bcrypt = require("bcryptjs");
const webToken = require("jsonwebtoken");
const InvalidTokenModel = require("../model/InvalidTokenModel");
require("dotenv").config();

// Show all results=======================================================================================================
router.get("", (req, res) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({
            message: "Unauthorized",
            status: res.statusCode
        });
    }

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

        webToken.verify(token, process.env.secret_key, (err, user) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Internal server error",
                    status: res.statusCode
                });
            }

            if (user) {
                ResultModel.findAll({})
                    .then((value) => {
                        return res.status(200).json({
                            message: "Success",
                            status: res.statusCode,
                            data: value
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                        return res.status(500).json({
                            message: "Internal server error",
                            status: res.statusCode
                        });
                    });
            } else {
                return res.status(401).json({
                    message: "Please login",
                    status: res.statusCode
                });
            }
        });
    });
});



// Fetch a particular result by rollno===============================================================================
router.get("/:rollno", (req, res) => {
    const authHeader = req.headers["authorization"];
    const rollno = req.params.rollno;

    if (!authHeader) {
        return res.status(401).json({
            message: "Unauthorized",
            status: res.statusCode
        });
    }

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

        webToken.verify(token, process.env.secret_key, (err, user) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Internal server error",
                    status: res.statusCode
                });
            }

            if (user) {
                ResultModel.findOne({ where: { rollno: rollno } })
                    .then((result) => {
                        if (!result) {
                            return res.status(404).json({
                                message: "Result not found",
                                status: res.statusCode
                            });
                        }

                        return res.status(200).json({
                            message: "Success",
                            status: res.statusCode,
                            data: result
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                        return res.status(500).json({
                            message: "Internal server error",
                            status: res.statusCode
                        });
                    });
            }
        });
    });
});



///////ADD RESULT==========================================================================================
router.post("/add", (req, res) => {
    const { rollno, name, score, dateofbirth } = req.body;
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({
            message: "Unauthorized",
            status: res.statusCode
        });
    }

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

        webToken.verify(token, process.env.secret_key, (err, user) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Internal server error",
                    status: res.statusCode
                });
            }

            if (user) {
                if (
                    rollno === undefined ||
                    rollno === "" ||
                    name === undefined ||
                    name === "" ||
                    score === undefined ||
                    score === "" ||
                    dateofbirth === undefined ||
                    dateofbirth === ""
                ) {
                    return res.status(400).json({
                        message: "Fill all fields",
                        status: res.statusCode
                    });
                }

                ResultModel.create({
                    rollno: rollno,
                    name: name,
                    score: score,
                    dateofbirth: dateofbirth
                })
                    .then(() => {
                        return res.status(201).json({
                            message: "Result added successfully",
                            status: res.statusCode
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                        return res.status(500).json({
                            message: "Roll number already exists",
                            status: res.statusCode
                        });
                    });
            }
        });
    });
});



// Edit a result===========================================================================================
router.put("/edit/:rollno", (req, res) => {
    const { name, score, dateofbirth } = req.body;
    const authHeader = req.headers["authorization"];
    const rollno = req.params.rollno;

    if (!authHeader) {
        return res.status(401).json({
            message: "Unauthorized",
            status: res.statusCode
        });
    }

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

        webToken.verify(token, process.env.secret_key, (err, user) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Internal server error",
                    status: res.statusCode
                });
            }

            if (user) {
                if (
                    name === undefined ||
                    name === "" ||
                    score === undefined ||
                    score === "" ||
                    dateofbirth === undefined ||
                    dateofbirth === ""
                ) {
                    return res.status(400).json({
                        message: "Fill all fields",
                        status: res.statusCode
                    });
                }

                ResultModel.findOne({ where: { rollno: rollno } })
                    .then((result) => {
                        if (!result) {
                            return res.status(404).json({
                                message: "Result not found",
                                status: res.statusCode
                            });
                        }

                        result.name = name;
                        result.score = score;
                        result.dateofbirth = dateofbirth;

                        return result.save();
                    })
                    .then(() => {
                        return res.status(200).json({
                            message: "Result updated successfully",
                            status: res.statusCode
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                        return res.status(500).json({
                            message: "Internal server error",
                            status: res.statusCode
                        });
                    });
            }
        });
    });
});



// Delete a result============================================================================================
router.delete("/delete/:rollno", (req, res) => {
    const authHeader = req.headers["authorization"];
    const rollno = req.params.rollno;

    if (!authHeader) {
        return res.status(401).json({
            message: "Unauthorized",
            status: res.statusCode
        });
    }

    const token = authHeader.split("Bearer ")[1];

    InvalidTokenModel.findOne({
        where: {
            id: token
        }
    })
        .then((value) => {
            if (value != null) {
                return res.status(401).json({
                    message: "Invalid Token",
                    status: res.statusCode
                });
            }

            webToken.verify(token, process.env.secret_key, (err, user) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        message: "Internal server error",
                        status: res.statusCode
                    });
                } else if (user) {
                    ResultModel.findOne({ where: { rollno: rollno } })
                        .then((result) => {
                            if (!result) {
                                return res.status(404).json({
                                    message: "Result not found",
                                    status: res.statusCode
                                });
                            }

                            return result.destroy().then(() => {
                                res.status(200).json({
                                    message: "Result deleted successfully",
                                    status: res.statusCode
                                });
                            });
                        })
                        .catch((error) => {
                            console.error(error);
                            res.status(500).json({
                                message: "Internal server error",
                                status: res.statusCode
                            });
                        });
                }
            });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({
                message: "Internal server error",
                status: res.statusCode
            });
        });
});

module.exports = router;
