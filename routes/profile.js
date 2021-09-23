"use strict";

const express = require('express');
const router = express.Router();
const userDao = require('../models/user-dao');
const User = require('../entities/user');
const { body, validationResult } = require('express-validator');
const logger = require('../util/logger');

router.get("/", (req, res, _next) => {
    res.render("profile", {
        user: req.user, styles: [
            'stylesheets/profile.css'
        ], scripts: ['javascripts/profile.js']
    });
});

router.post("/profile/update-email", [
    body('new-email').trim().isEmail().withMessage("Please enter a valid email").escape()
], async (req, res, _next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        let user = new User(
            req.user.id,
            req.user.firstName,
            req.user.lastName,
            req.body.email,
            req.user.password,
            req.user.address_id,
            req.user.role
        );

        await userDao.updateUser(user);
        logger.logInfo(`Updated user with id: ${user.id}`);

        res.render("profile", {
            user: user, styles: ['stylesheet/profile.css'],
            scripts: ['javascripts/profile.js'], message: "Email updated successfully"
        });
    } else {
        res.render("profile", {
            user: req.user, styles: ['stylesheet/profile.css'],
            scripts: ['javascripts/profile.js'], errors: errors.array()
        });
    }
});

router.post("/profile/update-password", [
    body('new-password').matches(/^.*(?=.{8,})(?=.*[\d])(?=.*[\W]).*$/).escape().withMessage("Password must be at least 8 characters long and contain at least one number and one non-alphanumeric character"),
], async (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        let user = new User(
            req.user.id,
            req.user.firstName,
            req.user.lastName,
            req.user.email,
            req.body.password,
            req.user.address_id,
            req.user.role
        );

        await userDao.updateUser(user);
        logger.logInfo(`Updated user with id: ${user.id}`);

        res.render("profile", {
            user: user, styles: ['stylesheet/profile.css'],
            scripts: ['javascripts/profile.js'], message: "Password updated successfully"
        });
    }
});

module.exports = router;