"use strict";

const express = require('express');
const router = express.Router();
const bookDao = require('../models/book-dao');

router.get('/:bookId', function (req, res) {
    const bookId = req.params.bookId;

    bookDao.findBookById(bookId)
        .then(book => {
            res.render('book-details', {
                user: req.user, book: book,
                styles: ['/stylesheets/book-details.css'],
                scripts: ['/javascripts/book-details.js']
            });
        })
        .catch(err => {
            res.status(404).render('book-details', {
                user: req.user, errors: [err],
                styles: ['/stylesheets/book-details.css'],
                scripts: ['/javascripts/book-details.js']
            });
        });
});

module.exports = router;