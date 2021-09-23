"use strict";

const express = require('express');
const router = express.Router();

router.get('/', (req, res, _next) => {
    res.render('index', { user: req.user, styles: [
        'stylesheets/index.css'
    ], scripts: [ 'javascripts/logout.js' ] });
});

module.exports = router;