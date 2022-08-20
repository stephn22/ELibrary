"use strict";

const express = require('express');
const router = express.Router();
const userDao = require('../models/user-dao');
const { body, validationResult } = require('express-validator');
const logger = require('../util/logger');
const bcrypt = require('bcrypt');

router.get("/", (req, res, _next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    res.render("profile", {
        user: req.user,
        styles: ['/stylesheets/profile.css'],
        scripts: ['/javascripts/profile.js']
    });
});

router.post("/update-email", [
    body('new-email').trim().isEmail().withMessage("Please enter a valid email").escape()
], async (req, res, _next) => {
    const errors = validationResult(req);

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);
    
    if (errors.isEmpty()) {
        const user = await userDao.findUserByEmail(req.user.email);

        user.email = req.body['new-email'];

        await userDao.updateUser(user);
        logger.logInfo(`Updated user with id: ${user.id}`);

        res.render("profile", {
            user: user,
            styles: ['/stylesheets/profile.css'],
            scripts: ['/javascripts/profile.js'],
            message: "Email updated successfully"
        });
    } else {
        logger.logError(JSON.stringify(errors));

        res.render("profile", {
            user: req.user,
            styles: ['/stylesheets/profile.css'],
            scripts: ['/javascripts/profile.js'],
            errors: errors.array()
        });
    }
});

router.post("/update-password", [
    body('new-password').matches(/^.*(?=.{8,})(?=.*[\d])(?=.*[\W]).*$/).escape().withMessage("Password must be at least 8 characters long and contain at least one number and one non-alphanumeric character"),
], async function (req, res, _next) {
    const errors = validationResult(req);

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    if (errors.isEmpty()) {
        const user = await userDao.findUserById(req.user.id);
        const oldPassword = user.password;

        const check = await bcrypt.compare(req.body['current-password'], oldPassword);

        if (!check) {
            throw new Error("Incorrect current password.");
        }

        if (req.body['new-password'] !== req.body['confirm-new-password']) {
            throw new Error("New password and confirm do not match.");
        }

        await userDao.updateUser(user, req.body['new-password']);
        logger.logInfo(`Updated user with id: ${user.id}`);

        res.render("profile", {
            user: user,
            styles: ['/stylesheets/profile.css'],
            scripts: ['/javascripts/profile.js'],
            message: "Password updated successfully"
        });
    } else {
        logger.logError(JSON.stringify(errors));

        res.render("profile", {
            user: req.user,
            errors: errors.array(),
            styles: ['/stylesheets/profile.css'],
            scripts: ['/javascripts/profile.js'],
            errors: errors.array()
        });
    }
});

module.exports = router;