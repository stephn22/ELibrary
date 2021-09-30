"use strict";

const express = require('express');
const router = express.Router();

const bookDao = require('../models/book-dao');
const orderDao = require('../models/order-dao');
const reviewDao = require('../models/review-dao');

router.get('/books', async (_req, res) => {
    const books = await bookDao.findAllBooks();
    res.json(books);
});

router.get('/orders', async (_req, res) => {
    const orders = await orderDao.findAllOrders();
    res.json(orders);
});

router.get('/reviews', async (_req, res) => {
    const reviews = await reviewDao.findAllReviews();
    res.json(reviews);
});

module.exports = router;