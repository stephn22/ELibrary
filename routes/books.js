"use strict";

const express = require('express');
const router = express.Router();
const bookDao = require('../models/book-dao');

router.get('/', async (req, res, next) => {
    const books = await bookDao.findAllBooks();

    res.render('books', { user: req.user, books: books, styles: [
        'stylesheets/books.css'
    ], scripts: ['javascripts/books.js'] }); // TODO: update to use books.js
});

router.post('/');

module.exports = router;