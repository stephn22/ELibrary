"use strict";

const express = require('express');
const router = express.Router();
const passport = require('passport');
const logger = require('../util/logger');

// login
router.get("/login", (_req, res, _next) => {
    res.render("login");
});

router.post("/sessions", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            logger.logError(err);
            return next(err);
        }
        if (!user) {
            logger.logError(info.message);
            return res.render("login", { errors: info.message });
        }

        // success
        req.login(user, (err) => {
            if (err) {
                logger.logError(err);
                return next(err);
            }
            res.render("/", { user: user });

            logger.logInfo("User logged in successfully");
            // TODO: log user in user types etc
        });
    })(req, res, next);
});

router.delete("/sessions/current", (req, res, _next) => {
    logger.logInfo("User logged out successfully");
    req.logout();
    res.end();
});

module.exports = router;