"use strict";

const express = require("express");
const orderStatus = require("../entities/constants/order-status");
const router = express.Router();
const Order = require("../entities/order");
const orderDao = require("../models/order-dao");
const bookDao = require("../models/book-dao");
const logger = require("../util/logger");
const Cart = require("../entities/cart");
const orderType = require("../entities/constants/order-type");

router.get('/', async (req, res, _next) => {
    const orders = await orderDao.findAllOrders();

    res.render('orders', {
        user: req.user,
        orders: orders
    });
});

router.get('/customer-orders', async (req, res, _next) => {
    const id = parseInt(req.user.id);
    const orders = await orderDao.findOrdersByCustomerId(id);

    res.render('customer-orders', {
        user: req.user,
        orders: orders
    });
});

router.get('/:id', (req, res, _next) => {
    const id = parseInt(req.params.id);

    orderDao.findOrderById(id).then(order => {
        if (order.hasOwnProperty("error")) {
            logger.logWarn(JSON.stringify(order));

            res.render('order-details', {
                user: req.user,
                message: "No such order",

            });
        } else {
            res.render('order', {
                user: req.user,
                order: order
            });
        }
    }).catch(err => {
        logger.logError(err);
        res.render('order-details', {
            user: req.user,
            errors: [err]
        });
    });
});

router.post('/reserve', async function (req, res, _next) {
    const customerId = parseInt(req.body.userId);
    const bookId = parseInt(req.body.bookId);
    const price = parseFloat(req.body.price);

    const order = new Order(
        undefined,
        customerId,
        new Date(),
        price,
        orderStatus.NEW,
        orderType.RESERVATION,
    );

    orderDao.addOrder(order, bookId, 0)
        .then(async (id) => {
            logger.logInfo(`Added order with id: ${id}`);

            const orders = await orderDao.findOrdersByCustomerId(customerId);

            res.render('books', {
                user: req.user,
                orders: orders,
                message: "Order added successfully",
                styles: ['/stylesheets/books.css'],
                scripts: ['/javascripts/books.js']
            });
        })
        .catch(async (err) => {
            logger.logError(err);

            const books = await bookDao.findAllBooks();
            res.render('books', {
                user: req.user,
                errors: [err],
                books: books,
                styles: ['/stylesheets/books.css'],
                scripts: ['/javascripts/books.js']
            });
        });

});

router.get('/customer-orders', async (req, res, _next) => {
    const id = req.user.id;

    const orders = await orderDao.findOrdersByCustomerId(id);

    res.render('customer-orders', {
        user: req.user,
        orders: orders,
        styles: ['/stylesheets/orders.css']
    });
});

router.post('/customer-orders', async function (req, res, _next) {
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
            cart.price,
            orderStatus.NEW,
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
});

module.exports = router;