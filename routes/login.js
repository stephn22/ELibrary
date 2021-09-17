"use strict";

const express = require('express');
const router = express.Router();

router.get("/", (_req, res, _next) => {
    res.render("login");
});

module.exports = router;