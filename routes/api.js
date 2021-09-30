"use strict";

const express = require('express');
const router = express.Router();

const bookDao = require('../models/book-dao');
const orderDao = require('../models/order-dao');
const reviewDao = require('../models/review-dao');

// GET all books
router.get('/books', async (_req, res) => {
    const books = await bookDao.findAllBooks();
    res.json(books);
});

// GET book by id
router.get('/books/:id', async function (req, res) {
    const id = parseInt(req.params.id);

    const book = await bookDao.findBookById(id);

    res.json(book);
});

// GET all orders
router.get('/orders', async (_req, res) => {
    const orders = await orderDao.findAllOrders();
    res.json(orders);
});

// GET order by id
router.get('/reviews', async (_req, res) => {
    const reviews = await reviewDao.findAllReviews();
    res.json(reviews);
});

module.exports = router;