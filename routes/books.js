"use strict";

const express = require('express');
const { body, validationResult } = require('express-validator');
const Book = require('../entities/book');
const router = express.Router();
const bookDao = require('../models/book-dao');
const logger = require('../util/logger');

router.get('/', async (req, res, _next) => {
    const books = await bookDao.findAllBooks();

    res.render('books', { user: req.user, books: books, styles: [
        'stylesheets/books.css'
    ], scripts: ['javascripts/books.js'] });
});

router.post('/books', [
    body('title').trim().isString().escape().withMessage('Please enter a valid title'),
    body('author').trim().isAlpha().escape().withMessage('Please enter a valid author name'),
    body('isbn').trim().isISBN().escape().withMessage('Please enter a valid ISBN'),
    body('publisher').trim().isString().escape().withMessage('Please enter a valid publisher'),
    body('stock').trim().isInt({ min: 1, max: 300 }).escape().withMessage('Please enter a valid stock'),
    body('pages').trim().isInt({ min: 1, max: 10000 }).escape().withMessage('Please enter a valid number of pages'),
    body('date-published').trim().isDate().custom(_date => {
        // TODO: validate date format
    }).escape().withMessage('Please enter a valid date published'),
    body('description').trim().isAlphanumeric().isLength({ min: 1, max: 250 }).escape().withMessage('Please enter a valid description'),
    body('price').trim().isCurrency({ allow_negatives: false }).escape().withMessage('Please enter a valid price')
], (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        const book = new Book(
            undefined,
            req.body.title,
            undefined,
            req.body.isbn,
            req.body.type,
            req.body.stock,
            req.body.language,
            req.body.pages,
            req.body.publisher,
            req.body['date-published'],
            req.body.description,
            undefined,
            req.body.price
        );

        let bookId = bookDao.addBook(book);
        logger.logInfo(`Added book with id: ${bookId}`);


        // TODO: author

        res.render('books', { user: req.user, books: [book], styles: [
            'stylesheets/books.css'
        ], scripts: ['javascripts/books.js'] });
    }
});

module.exports = router;