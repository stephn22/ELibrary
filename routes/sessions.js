"use strict";

const express = require('express');
const router = express.Router();
const passport = require('passport');
const logger = require('../util/logger');
const Cart = require('../entities/cart');
const bookDao = require('../models/book-dao');

// login
router.get("/login", (_req, res, _next) => {
    res.render("login", {
        styles: ['/stylesheets/forms.css']
    });
});

router.post("/sessions", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            logger.logError(err);
            return next(err);
        }
        if (!user) {
            logger.logError(info.message);

            return res.render("login", {
                errors: info.message,
                styles: ['/stylesheets/forms.css']
            });
        }

        // success
        req.login(user, (err) => {
            if (err) {
                logger.logError(err);
                return next(err);
            }
            res.render("index", {
                user: user,
                styles: ['/stylesheets/index.css']
            });

            logger.logInfo("User logged in successfully");
        });
    })(req, res, next);
})

router.delete("/sessions/current", (req, res, _next) => {
    logger.logInfo("User logged out successfully");
    req.logout();
    res.end();
});

/************************** SHOPPING CART *****************************/

router.get('/sessions/cart', function (req, res, next) {
    if (!req.sessions.cart) {
        res.render('/', {
            user: req.user,
            cart: undefined,
            styles: ['/stylesheets/index.css']
        });
    } else {
        res.render('/', {
            user: req.user,
            cart: req.sessions.cart,
            styles: ['/stylesheets/index.css']
        });
    }
});

// add to cart
router.put('/sessions/cart/:id/:qty', async function (req, res, _next) {
    const bookId = parseInt(req.params.id);
    const quantity = parseInt(req.params.qty);

    const book = await bookDao.findBookById(bookId);

    /**
     * @type {Cart}
     */
    const cart = req.session.cart ? req.session.cart : undefined;

    if (cart) {
        cart.add(book, quantity);
    } else {
        cart = new Cart([book]);
    }

    req.session.cart = cart;
    res.redirect('/');
});

router.delete('/sessions/cart/:id/:qty?', async function (req, res, _next) {
    const bookId = parseInt(req.params.id);
    const quantity = parseInt(req.params.qty);

    const book = await bookDao.findBookById(bookId);

    /**
     * @type {Cart}
     */
    const cart = req.session.cart ? req.session.cart : undefined;

    if (cart) {
        cart.remove(book, quantity);
    }

    req.session.cart = cart;
    res.redirect('/');
});

module.exports = router;