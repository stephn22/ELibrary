"use strict";

const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../entities/user');
const Address = require('../entities/address');
const userDao = require('../models/user-dao');
const addressDao = require('../models/address-dao');
const { urlencoded } = require('body-parser'); // TODO:

router.get("/", (_req, res, _next) => {
    res.render("register", { title: "Register" });
});

// server side validation
router.post("/", [
    body("fname").trim().matches(/^[a-zA-Z ]{1,50}$/).escape().withMessage("Please enter a valid first name"),
    body("lname").trim().matches(/^[a-zA-Z ]{1,50}$/).escape().withMessage("Please enter a valid last name"),
    body("email").trim().isEmail().escape().withMessage("Please enter a valid email address"),
    body("password").matches(/^.*(?=.{8,})(?=.*[\d])(?=.*[\W]).*$/).escape().withMessage("Password must be at least 8 characters long and contain at least one number and one non-alphanumeric character"),
    // TODO: confirm password?
    body("address").trim().isLength(0, 50).escape().withMessage("Please enter a valid address"),
], async (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        const user = new User(
            undefined,
            req.body.fname,
            req.body.lname,
            req.body.email,
            req.body.password,
            undefined
        );

        // add the new user to the database
        const userId = await userDao.addUser(user);

        // TODO: logger

        // if address was submitted, add it to the database
        if (req.body.address != undefined) {
            const address = new Address(
                undefined,
                userId,
                req.body.address
            );

            const addressId = await addressDao.addAddress(address);
            
            // and associate it with the user
            user.address_id = addressId;

            await userDao.updateUser(user);
        }

        res.render("login");
    } else {
        console.log(errors);
        res.render("register", { title: "Register", message: errors.array() });
    }
});

module.exports = router;