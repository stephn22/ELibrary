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

    if (orders.hasOwnProperty("error")) {
        res.render('orders', {
            user: req.user,
            message: "No orders found"
        });
    } else {
        res.render('orders', {
            user: req.user, orders: orders
        });
    }
});

router.post('/reserve', async function (req, res, _next) {
    const customerId = parseInt(req.body.userId);
    const bookId = parseInt(req.body.bookId);
    const type = req.body.type;
    const address = req.body.address;
    const price = parseFloat(req.body.price);

    const order = new Order(
        undefined,
        customerId,
        new Date(),
        price,
        address,
        orderStatus.NEW,
        type
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

router.post('/', async function(req, res, _next) {
    const customerId = parseInt(req.body.userId);
    // TODO:
});

module.exports = router;