"use strict";

const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('books', { user: req.user, styles: [
        'stylesheets/books.css'
    ], scripts: ['javascripts/books.js'] }); // TODO: update to use books.js
});

module.exports = router;