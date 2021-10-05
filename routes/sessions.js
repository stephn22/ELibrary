"use strict";

const express = require('express');
const router = express.Router();
const passport = require('passport');
const logger = require('../util/logger');
const Cart = require('../entities/cart');
const CartItem = require('../entities/cartItem');
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
    if (!req.session.cart) {
        res.render('cart', {
            user: req.user,
            cart: undefined,
            styles: ['/stylesheets/cart.css']
        });
    } else {
        res.render('cart', {
            user: req.user,
            cart: req.session.cart,
            styles: ['/stylesheets/cart.css']
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
    let cart = req.session.cart ? req.session.cart : undefined;

    if (cart !== undefined) {
        logger.logDebug(cart.total);

        cart.items.forEach(element => {
            if (element.id === bookId) {
                element.updateQuantity(element.quantity + quantity);
            } else {
                cart.items.push(new CartItem(book, quantity));
            }
        });

        logger.logInfo("Book added to cart successfully");
    } else {
        cart = new Cart([book]);
        logger.logDebug(cart.total);
        logger.logInfo("Book added to cart successfully (created a new cart)");
    }

    req.session.cart = cart;
    res.send(cart);
});

router.delete('/sessions/cart/:id/:qty?', async function (req, res, _next) {
    const bookId = parseInt(req.params.id);
    const quantity = req.params.qty ? parseInt(req.params.qty) : 0;

    const book = await bookDao.findBookById(bookId);

    /**
     * @type {Cart}
     */
    const cart = req.session.cart ? req.session.cart : undefined;

    if (cart) {
        cart.remove(book, quantity);
        logger.logInfo("Book removed from cart successfully");
    }

    req.session.cart = cart;
    res.redirect('/');
});

module.exports = router;