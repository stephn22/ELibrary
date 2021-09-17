"use strict";

import { Router } from 'express';
const router = Router();
import { authenticate } from 'passport';

// login
router.get("/login", (_req, res, _next) => {
    res.render("login");
});

router.post("/sessions", (req, res, next) => {
    authenticate("local", (err, user, info) => {
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
        });
    })(req, res, next);
});

router.delete("/sessions", (req, res, _next) => {
    req.logout();
    res.end();
});

export default router;