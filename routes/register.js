"use strict";

const { urlencoded } = require('express');
const express = require('express');
const router = express.Router();

router.get("/", (_req, res, _next) => {
    res.render("register");
});

// TODO: server side validation
router.post("/", );

module.exports = router;