"use strict";

const express = require('express');
const router = express.Router();
const passport = require('passport');

// login
router.get("/login", (_req, res, _next) => {
    res.render("login");
});

router.post("/sessions", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.render("login", { "message": info.message });
        }

        // success
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            res.redirect("/");

            // TODO: log user in user types etc
        });
    })(req, res, next);
});

router.delete("/sessions/current", (req, res, _next) => {
    req.logout();
    res.end();
});

module.exports = router;