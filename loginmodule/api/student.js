const express = require("express");
const router = express.Router();
const ResultModel = require("../model/ResultModel");
const bcrypt = require("bcryptjs");
const webToken = require("jsonwebtoken");
require("dotenv").config();

//fetch result by roll number and date of birth
router.post("", (req, res) => {
    const { rollno, dateofbirth } = req.body;
    if (
        rollno === undefined ||
        rollno === "" ||
        dateofbirth === undefined ||
        dateofbirth === ""
    ) {
        return res.status(400).json({
            message: "Fill all fields",
            status: res.statusCode
        });
    }

    ResultModel.findOne({
        where: { rollno: rollno }
    })
        .then((result) => {
            if (!result) {
                return res.status(404).json({
                    message: "Result not found",
                    status: res.statusCode
                });
            }
            if (result.getDataValue("dateofbirth") !== dateofbirth) {
                return res.status(404).json({
                    message: "Wrong Date of Birth",
                    status: res.statusCode
                });
            }
            else {
                return res.status(200).json({
                    message: "Success",
                    status: res.statusCode,
                    data: result
                })
            }
        })
})

module.exports = router