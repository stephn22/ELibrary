"use strict";

const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../entities/user');
const Address = require('../entities/address');
const userDao = require('../models/user-dao');
const addressDao = require('../models/address-dao');
const { urlencoded } = require('body-parser'); // TODO:
const logger = require('../util/logger');
const { log } = require('debug/src/browser');

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
        logger.logInfo(`New user created with id: ${userId}`);

        // if address was submitted, add it to the database
        if (req.body.address != undefined) {
            const address = new Address(
                undefined,
                userId,
                req.body.address
            );

            const addressId = await addressDao.addAddress(address);
            logger.logInfo(`New address created with id: ${addressId}`);
            
            // and associate it with the user
            user.address_id = addressId;

            await userDao.updateUser(user);
            logger.logInfo(`Updated user with id: ${userId}`);
        }

        res.render("login");
    } else {
        logger.logError(errors);

        res.render("register", { title: "Register", message: errors.array() });
    }
});

module.exports = router;