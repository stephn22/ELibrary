"use strict";

const express = require('express');
const { body, validationResult } = require('express-validator');
const Book = require('../entities/book');
const router = express.Router();
const bookDao = require('../models/book-dao');
const logger = require('../util/logger');
const moment = require('moment');
const bookType = require('../entities/constants/book-type');

router.get('/', async (req, res, _next) => {
    const books = await bookDao.findAllBooks();

    res.render('books', {
        user: req.user, books: books, styles: [
            '/stylesheets/books.css'
        ], scripts: ['/javascripts/books.js']
    });
});

router.post('/', [
    body('title').trim().isString().escape().withMessage('Please enter a valid title'),
    body('author').trim().isAlpha().escape().withMessage('Please enter a valid author name'),
    body('isbn').trim().isISBN().escape().withMessage('Please enter a valid ISBN'),
    body('publisher').trim().isString().escape().withMessage('Please enter a valid publisher'),
    body('stock').trim().isInt({ min: 1, max: 300 }).escape().withMessage('Please enter a valid stock'),
    body('pages').trim().isInt({ min: 1, max: 10000 }).escape().withMessage('Please enter a valid number of pages'),
    body('date-published').isDate().isBefore(moment().format('YYYY-MM-DD')),
    body('description').isLength({ min: 1, max: 250 }).withMessage('Please enter a valid description'),

], async (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {

        const book = new Book(
            undefined,
            req.body.title,
            req.body.author,
            req.body.isbn,
            req.body.type === "Paper" ? bookType.PAPER : bookType.EBOOK,
            req.body.stock,
            req.body.language,
            req.body.pages,
            req.body.publisher,
            req.body.datePublished,
            req.body.description,
            undefined, // imgurl
            req.body.price
        );

        const bookId = await bookDao.addBook(book);
        logger.logInfo(`Added book with id: ${bookId}`);

        const books = await bookDao.findAllBooks();

        res.render('books', {
            user: req.user, message: "Book successsfully added", books: books, styles: [
                '/stylesheets/books.css'
            ], scripts: ['/javascripts/books.js']
        });
    } else {
        logger.logError(`Book not added: ${JSON.stringify(errors)}`);

        res.render('books', {
            user: req.user, books: [], styles: [
                '/stylesheets/books.css'
            ], scripts: ['/javascripts/books.js'], errors: errors.array()
        });
    }
});

module.exports = router;