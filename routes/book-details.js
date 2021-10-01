"use strict";

const express = require('express');
const multer = require('multer');
const moment = require('moment');
const router = express.Router();
const bookDao = require('../models/book-dao');
const bookType = require('../entities/constants/book-type');
const logger = require('../util/logger');
const Book = require('../entities/book');
const { check, validationResult } = require('express-validator');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

// FIXME: error 500

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

router.put('/:bookId', upload.single('new-img'), async function (req, res) {

    const bookId = parseInt(req.params.bookId);

    check('title').isString().isLength({ min: 1, max: 100 }).withMessage('Please enter a valid title');
    check('author').isString().isLength({ min: 1, max: 100 }).withMessage('Please enter a valid author name');
    check('isbn').isISBN().withMessage('Please enter a valid ISBN');
    check('publisher').isString().isLength({ min: 1, max: 100 }).withMessage('Please enter a valid publisher name');
    check('stock').isInt({ min: 1, max: 300 }).withMessage('Please enter a valid stock');
    check('pages').isInt({ min: 1, max: 10000 }).withMessage('Please enter a valid number of pages');
    check('price').isFloat({ min: 0.01, max: 100000 }).withMessage('Please enter a valid price');
    check('type').isIn([bookType.PAPER, bookType.EBOOK]).withMessage('Please enter a valid book type');
    check('date-published').isDate().isBefore(moment().format('YYYY-MM-DD')).withMessage('Please enter a valid date');
    check('description').isString().isLength({ min: 1, max: 250 }).withMessage('Please enter a valid description');

    const errors = validationResult(req);

    if (errors.isEmpty()) {
        const book = new Book(
            bookId,
            req.body.title,
            req.body.author,
            req.body.isbn,
            req.body.type === "Paper" ? bookType.PAPER : bookType.EBOOK,
            req.body.stock,
            req.body.language,
            req.body.pages,
            req.body.publisher,
            req.body['date-published'],
            req.body.description,
            req.file === undefined ? null : req.file.buffer,
            req.body.price);

        bookDao.updateBook(book)
            .then(async (id) => {
                logger.logInfo(`Updated book with id: ${id}`);

                res.render('book-details', {
                    user: req.user, message: "Book updated successfully", book: book,
                    styles: ['/stylesheets/book-details.css'],
                    scripts: ['/javascripts/book-details.js']
                });
            })
            .catch(async (err) => {
                logger.logError(err);

                const book = await bookDao.findBookById(bookId);

                res.render('book-details', {
                    user: req.user, book: book, errors: [err],
                    styles: ['/stylesheets/book-details.css'],
                    scripts: ['/javascripts/book-details.js']
                });
            });
    }
});

module.exports = router;