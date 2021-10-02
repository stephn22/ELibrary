"use strict";

const express = require("express");
const router = express.Router();
const Order = require("../entities/order");
const orderDao = require("../models/order-dao");

router.get('/', async (req, res, next) => {
    const orders = await orderDao.findAllOrders();

    if (orders.hasOwnProperty("error")) {
        res.render('orders', {
            user: req.user, message: "No orders found"
        });
    } else {
        res.render('orders', {
            user: req.user, orders: orders
        });
    }
});

module.exports = router;