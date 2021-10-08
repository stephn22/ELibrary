"use strict";

const express = require("express");
const orderStatus = require("../entities/constants/order-status");
const router = express.Router();
const Order = require("../entities/order");
const orderDao = require("../models/order-dao");
const bookDao = require("../models/book-dao");
const logger = require("../util/logger");

router.get('/', async (req, res, _next) => {
    const orders = await orderDao.findAllOrders();
    const cart = req.session.cart;

    if (orders.hasOwnProperty("error")) {
        res.render('orders', {
            user: req.user,
            cart: cart,
            message: "No orders found"
        });
    } else {
        res.render('orders', {
            user: req.user, orders: orders
        });
    }
});

router.post('/', async function (req, res, next) {
    const customerId = parseInt(req.body.userId);
    const bookId = parseInt(req.body.bookId);
    const type = req.body.type;
    const address = req.body.address;
    const price = parseFloat(req.body.price);

    const order = new Order(
        undefined,
        customerId,
        new Date(),
        bookId,
        price,
        address,
        orderStatus.NEW,
        type
    );

    orderDao.addOrder(order)
        .then(async (id) => {
            logger.logInfo(`Added order with id: ${id}`);
            const cart = req.session.cart;
            const orders = await orderDao.findAllOrders();
            // TODO: send orders to the user
        })
        .catch(async (err) => {
            logger.logError(err);

            const books = await bookDao.findAllBooks();
            const cart = req.session.cart;

            res.render('books', {
                user: req.user,
                cart: cart,
                errors: [err],
                books: books,
                styles: ['/stylesheets/books.css'],
                scripts: ['/javascripts/books.js']
            });
        });

});

module.exports = router;