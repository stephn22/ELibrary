"use strict";

const express = require('express');
const router = express.Router();
const bookDao = require('../models/book-dao');
const logger = require('../util/logger');

router.get('/:bookId', function (req, res) {
    const bookId  = req.params.bookId;

    logger.logDebug(`Book details requested for bookId: ${bookId}`);

    bookDao.findBookById(bookId)
        .then(book => {
            res.render('book-details', { user: req.user, book: book, styles: ['/stylesheets/books.css'] });
        })
        .catch(err => {
            res.status(500).render('book-details', { user: req.user, errors: [err] });
        });
});

module.exports = router;