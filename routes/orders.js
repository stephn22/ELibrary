"use strict";

const express = require("express");
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Order = require("../entities/order");
const User = require("../entities/user");
const userDao = require("../models/user-dao");
const orderDao = require("../models/order-dao");
const bookDao = require("../models/book-dao");
const logger = require("../util/logger");
const Cart = require("../entities/cart");
const orderType = require("../entities/constants/order-type");

router.get('/', (req, res, _next) => {
    orderDao.findAllOrders()
        .then((orders) => {

            userDao.findAllUsers().then((users) => {
                orders.forEach((order) => {
                    order.customer = users.find(user => user.id === order.customerId);

                    res.render('orders', {
                        user: req.user,
                        orders: orders,
                        styles: ['/stylesheets/orders.css'],
                    });
                });
            }).catch((err) => {
                logger.logError(err);

                res.render('orders', {
                    user: req.user,
                    errors: [err],
                    styles: ['/stylesheets/orders.css'],
                });
            });
        }).catch(err => {
            logger.logError(err);

            res.render('orders', {
                user: req.user,
                errors: [err],
                styles: ['/stylesheets/orders.css'],
            });
        });
});

router.get('/order-details/:id', async (req, res, _next) => {
    const id = parseInt(req.params.id);

    orderDao.findOrderById(id)
        .then(async (order) => {
            const user = await userDao.findUserById(order.customerId);
            order.customer = user;

            orderDao.findOrderItems(order.id)
                .then((items) => {
                    bookDao.findAllBooks().then((books) => {
                        items.forEach((item) => {
                            let book = books.find(book => book.id === item.bookId);

                            order.items.push({ book: book, quantity: item.quantity });
                        });

                        res.render('order-details', {
                            user: req.user,
                            order: order,
                            styles: ['/stylesheets/order-details.css'],
                        });
                    }).catch((err) => {
                        logger.logError(err);

                        res.render('order-details', {
                            user: req.user,
                            order: order,
                            errors: [err],
                            styles: ['/stylesheets/orders.css'],
                        });
                    });
                }).catch(err => {
                    logger.logError(err);

                    res.render('order-details', {
                        user: req.user,
                        order: order,
                        errors: [err],
                        styles: ['/stylesheets/orders.css'],
                    });
                });
        })
        .catch(err => {
            logger.logError(err);

            res.render('order-details', {
                user: req.user,
                errors: [err],
                styles: ['/stylesheets/order-details.css'],
            });
        });
});

router.get('/customer-orders', async (req, res, _next) => {
    const id = parseInt(req.user.id);
    orderDao.findOrdersByCustomerId(id)
        .then((orders => {
            logger.logInfo(`Found ${orders.length} orders for customer with id ${id}`);

            orders.forEach(async (order) => {
                let customer = await userDao.findUserById(order.customerId);

                order.customer = customer;
            });

            res.render('customer-orders', {
                user: req.user,
                orders: orders,
                styles: ['/stylesheets/orders.css']
            });
        })).catch(err => {
            logger.logError(err);

            res.render('customer-orders', {
                user: req.user,
                errors: [err],
                styles: ['/stylesheets/orders.css']
            });
        });
});

router.post('/reserve', async function (req, res, _next) {
    const customerId = parseInt(req.body.userId);
    const bookId = parseInt(req.body.bookId);

    const order = new Order(
        undefined,
        customerId,
        new Date(),
        0.00,
        orderType.RESERVATION,
    );

    const book = await bookDao.findBookById(bookId);

    orderDao.addOrder(order, [{ book: book, quantity: 0 }])
        .then(async (id) => {
            logger.logInfo(`Added order with id: ${id}`);

            res.redirect(`/orders/order-details/${id}`);

        }).catch(async (err) => {
            logger.logError(err);

            const book = await bookDao.findBookById(bookId);
            res.render('book-details', {
                user: req.user,
                errors: [err],
                book: book,
                styles: ['/stylesheets/book-details.css'],
                scripts: ['/javascripts/book-details.js']
            });
        });

});

router.post('/customer-orders', [
    body('payment-method').isIn(['credit-card', 'debit-card']).withMessage('Invalid payment method'),
    body('full-name').isString().withMessage('Invalid person name'),
    body('card-number').isCreditCard().withMessage('Invalid card number'),
    body('expiration-date').custom((date) => {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        const exDate = new Date(date);
        const exMonth = exDate.getMonth() + 1;
        const exYear = exDate.getFullYear();

        return /^\d{4}-\d{2}$/.test(date) && (exYear > year || (exYear === year && exMonth >= month));
    }).withMessage('Invalid expiration date'),
    body('cvv').isInt().isLength({ min: 3, max: 4 }).withMessage('Invalid CVV')
], async function (req, res, _next) {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        const customerId = parseInt(req.body.userId);

        /**
         * @type {Cart}
         */
        let cart = req.session.cart;

        if (cart !== undefined) {
            const order = new Order(
                undefined,
                customerId,
                new Date().toDateString(),
                parseFloat(cart.price.toFixed(2)),
                orderType.BUY);

            orderDao.addOrder(order, cart.items)
                .then(async (id) => {
                    logger.logInfo(`Added order with id: ${id}`);

                    const orders = await orderDao.findOrdersByCustomerId(customerId);

                    res.render('customer-orders', {
                        user: req.user,
                        message: "Order added successfully",
                        orders: orders,
                        styles: ['/stylesheets/orders.css']
                    });

                }).catch((err) => {
                    logger.logError(err);

                    res.render('checkout', {
                        user: req.user,
                        errors: [err],
                        cart: cart,
                        styles: ['/stylesheets/checkout.css'],
                        scripts: ['/javascripts/checkout.js'],
                    });
                });
        }
    } else {
        logger.logError(JSON.stringify(errors));

        res.render('checkout', {
            user: req.user,
            errors: errors.array(),
            cart: req.session.cart,
            styles: ['/stylesheets/checkout.css'],
            scripts: ['/javascripts/checkout.js']
        });
    }
});

module.exports = router;