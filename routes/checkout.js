"use strict";

const express = require("express");
const router = express.Router();

router.get("/", (req, res, _next) => {
    res.render("checkout", {
        user: req.user,
        cart: req.session.cart,
        styles: ['/stylesheets/checkout.css'],
        scripts: ['/javascripts/checkout.js']
    });
});

module.exports = router;