"use strict";

const express = require('express');
const router = express.Router();

router.get('/', (req, res, _next) => {
    const cart = req.session.cart;
    
    res.render('index', {
        user: req.user,
        cart: cart,
        styles: ['/stylesheets/index.css']
    });
});

module.exports = router;