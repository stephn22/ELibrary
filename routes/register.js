"use strict";

const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../entities/user');
const userDao = require('../models/user-dao');
const Type = require('../entities/constants/user-type');
const { urlencoded } = require('body-parser');
const logger = require('../util/logger');

router.get("/", (_req, res, _next) => {
    res.render("register", {
        styles: ['/stylesheets/forms.css'],
        scripts: ['/javascripts/register-form.js']
    });
});

// server side validation
router.post("/", [
    body("fname").trim().matches(/^[a-zA-Z ]{1,50}$/).escape().withMessage("Please enter a valid first name"),
    body("lname").trim().matches(/^[a-zA-Z ]{1,50}$/).escape().withMessage("Please enter a valid last name"),
    body("email").trim().isEmail().withMessage("Please enter a valid email").escape()
        .custom(async function (email) {
            const user = await userDao.findUserByEmail(email);

            if (!user.hasOwnProperty("error")) { // if findUserByEmail finds a user and not the error "user not found";
                logger.logDebug(`User already exists with email ${email}`);
                throw new Error("Email is already registered");
            }
        }),
    body("password").matches(/^.*(?=.{8,})(?=.*[\d])(?=.*[\W]).*$/).escape().withMessage("Password must be at least 8 characters long and contain at least one number and one non-alphanumeric character"),
], async function (req, res) {
    const errors = validationResult(req);

    if (errors.isEmpty()) {

        if (req.body['confirm-password'] !== req.body.password) {
            throw new Error("Passwords do not match");
        }

        logger.logDebug(JSON.stringify(req.body));

        const user = new User(
            undefined,
            req.body.fname,
            req.body.lname,
            req.body.email,
            req.body.password,
            Type.CUSTOMER
        );

        // add the new user to the database
        let userId = await userDao.addUser(user);
        logger.logInfo(`New user added with id: ${userId}`);

        res.render("login", {
            title: "Login",
            message: "Successfully registered",
            styles: ['/stylesheets/forms.css']
        });
    } else {
        logger.logError(JSON.stringify(errors));

        res.render("register", {
            title: "Register",
            errors: errors.array(),
            styles: ['/stylesheets/forms.css'],
            scripts: ['/javascripts/register-form.js']
        });
    }
});

module.exports = router;