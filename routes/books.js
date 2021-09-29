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
    body('title').isString().escape().withMessage('Please enter a valid title'),
    body('author').isAlpha().escape().withMessage('Please enter a valid author name'),
    body('isbn').trim().isISBN().escape().withMessage('Please enter a valid ISBN'),
    body('publisher').trim().isString().escape().withMessage('Please enter a valid publisher'),
    body('stock').trim().isInt({ min: 1, max: 300 }).escape().withMessage('Please enter a valid stock'),
    body('pages').trim().isInt({ min: 1, max: 10000 }).escape().withMessage('Please enter a valid number of pages'),
    body('date-published').isDate().isBefore(moment().format('YYYY-MM-DD')),
    body('description').isLength({ min: 1, max: 250 }).withMessage('Please enter a valid description'),

], async function (req, res) {
    const errors = validationResult(req);

    // FIXME: req.body empty

    if (errors.isEmpty()) {

        logger.logDebug(`Creating new book: ${JSON.stringify(req.body)}`);

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
            req.body['date-published'],
            req.body.description,
            req.body['book-image'],
            req.body.price
        );

        bookDao.addBook(book)
            .then(async function (id) {
                logger.logInfo(`Added book with id: ${id}`);

                const books = await bookDao.findAllBooks();

                res.render('books', {
                    user: req.user, message: "Book successsfully added", books: books, styles: [
                        '/stylesheets/books.css'
                    ], scripts: ['/javascripts/books.js']
                });
            })
            .catch(async (err) => {
                logger.logError(`Error adding book: ${err}`);

                const books = await bookDao.findAllBooks();

                res.render('books', {
                    user: req.user, errors: [`Error adding book: ${err}`], books: books, styles: [
                        '/stylesheets/books.css'
                    ], scripts: ['/javascripts/books.js']
                });
            });
    } else {
        logger.logError(`Book not added: ${JSON.stringify(errors)}`);

        const books = await bookDao.findAllBooks();

        res.render('books', {
            user: req.user, books: books, styles: [
                '/stylesheets/books.css'
            ], scripts: ['/javascripts/books.js'], errors: errors.array()
        });
    }
});

router.delete('/:id', async function (req, res) {
    const bookId = req.params.id;

    await bookDao.deleteBook(bookId);
    logger.logInfo(`Deleted book with id: ${bookId}`);

    const books = await bookDao.findAllBooks();

    res.render('books', {
        user: req.user, books: books, message: "Book successfully deleted", styles: [
            '/stylesheets/books.css'
        ], scripts: ['/javascripts/books.js']
    });
});

module.exports = router;