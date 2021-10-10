"use strict";

const express = require('express');
const router = express.Router();
const passport = require('passport');
const logger = require('../util/logger');
const Book = require('../entities/book');
const Cart = require('../entities/cart');
const bookDao = require('../models/book-dao');
const featuresDao = require('../models/features-dao');

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
        req.login(user, async (err) => {
            if (err) {
                logger.logError(err);
                return next(err);
            }
            const features = await featuresDao.findAllFeatures();
            const books = await bookDao.findAllBooks();

            // fill feature properties
            features.forEach(feature => {
                books.forEach(book => {
                    if (book.id === feature.book_id) {
                        feature.book = book;
                    }
                });
            });

            res.render("index", {
                user: user,
                features: features,
                books: books,
                styles: ['/stylesheets/index.css'],
                scripts: ['/javascripts/index.js']
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

router.get('/sessions/cart', function (req, res, _next) {
    if (!req.session.cart) {
        res.render('cart', {
            user: req.user,
            cart: undefined,
            styles: ['/stylesheets/cart.css'],
            scripts: ['/javascripts/cart.js']
        });
    } else {
        res.render('cart', {
            user: req.user,
            cart: req.session.cart,
            styles: ['/stylesheets/cart.css'],
            scripts: ['/javascripts/cart.js']
        });
    }
});

// add to cart
// FIXME: weird behaviour when adding the same book multiple times
router.post('/sessions/cart/:id/:qty', async function (req, res, _next) {
    const bookId = parseInt(req.params.id);
    const quantity = parseInt(req.params.qty);

    const book = await bookDao.findBookById(bookId);

    /**
     * @type {Cart}
     */
    let cart = req.session.cart ? req.session.cart : undefined;

    if (cart !== undefined) {
        addItem(cart, book, quantity);

        logger.logInfo("Book added to cart successfully");
    } else {
        cart = new Cart(book, quantity);
        logger.logInfo("Book added to cart successfully (created a new cart)");
    }

    req.session.cart = cart;
    res.send(cart);
});

// edit cart
// FIXME: weird behaviour when editing quantity
router.put('/sessions/cart/:id/:qty', async function (req, res, _next) {
    const bookId = parseInt(req.params.id);
    const quantity = parseInt(req.params.qty);

    /**
     * @type {Cart}
     */
    const cart = req.session.cart ? req.session.cart : undefined;

    if (cart !== undefined) {
        cart.items.forEach(element => {
            if (element.book.id === bookId) {
                element.quantity = quantity;
            }
        });

        cart.price = getTotalPrice(cart);
        logger.logInfo("Book quantity updated successfully");
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
        removeItem(cart, book, quantity);

        logger.logInfo("Book removed from cart successfully");
    }

    req.session.cart = cart;
    res.send(cart);
});

/************************** CART *****************************/

/**
 * Calculates the total price of the cart
 * @param {Cart} cart cart to calculate the total price
 * @returns {number} total price of the cart
 */
function getTotalPrice(cart) {
    let totalPrice = 0.00;

    cart.items.forEach(element => {
        totalPrice += (element.book.price * element.quantity);
    });

    return totalPrice;
}

/**
 * Adds a book to the cart
 * @param {Cart} cart cart to add the book to
 * @param {Book} item book to add to the cart
 * @param {number} quantity quantity of the book to add to the cart
 */
function addItem(cart, item, quantity) {
    cart.items.forEach(element => {
        if (element.book.id === item.id) {
            element.quantity += quantity;
        } else {
            logger.logDebug('different');
            cart.items.push({
                book: item,
                quantity: quantity
            });
        }
    });

    cart.price = getTotalPrice(cart);
    cart.total += quantity;
}

/**
 * Removes a book from the cart
 * @param {Cart} cart cart to remove the book from
 * @param {Book} item book to remove from the cart
 * @param {number} quantity quantity of the book to remove from the cart, if 0 remove all items
 */
function removeItem(cart, item, quantity = 0) {
    if (quantity === 0) {
        let i = -1;
        let qty = 0;

        cart.items.forEach(element => {
            if (element.book.id === item.id) {
                i = cart.items.indexOf(element);
                qty = element.quantity;
            }
        });

        if (i > -1) {
            cart.items.splice(i, 1); // remove item
            cart.total -= qty; // update total quantity
            cart.price = getTotalPrice(cart); // update total price
        }
    } else {
        cart.items.forEach(element => {
            if (element.book.id === item.id) {
                element.quantity -= quantity;
                total -= quantity;
            }
        });
    }

    cart.total -= quantity; // update total quantity
    cart.price = getTotalPrice(cart); // update total price
}

module.exports = router;