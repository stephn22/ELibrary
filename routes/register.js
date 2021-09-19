"use strict";

const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../entities/user');
const userDao = require('../models/user-dao');
const { urlencoded } = require('body-parser');

router.get("/", (_req, res, _next) => {
    res.render("register", { title: "Register" });
});

// server side validation
router.post("/", [
    check("fname").isLength({ min: 1, max: 50 }).exists().withMessage("Please enter a valid first name"),
    check("lname").isLength({ min: 1, max: 50 }).exists().withMessage("Please enter a valid last name"),
    check("signup-email").isEmail().exists()
        .custom(async (email) => { // check if email is unique
            const user = await userDao.getUserByEmail(email);

            if (user) {
                return Promise.reject("Email is already registered");
            }
        }).withMessage("Please enter a valid email address"),
    check("signup-password").matches(/^.*(?=.{8,})(?=.*[\d])(?=.*[\W]).*$/).withMessage("Password must be at least 8 characters long and contain at least one number and one non-alphanumeric character"),
    check("address-input").isLength({ min: 0, max: 50 })
], (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        const user = new User(
            undefined,
            req.body.fname,
            req.body.lname,
            req.body["signup-email"],
            req.body["signup-password"],
            req.body["address-input"]
        );

        userDao.addUser(user);
        res.render("login");
    } else {
        // TODO: show errors
    }
});

module.exports = router;