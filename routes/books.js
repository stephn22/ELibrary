"use strict";

// FIXME: date is not valid

const express = require('express');
const { body, validationResult } = require('express-validator');
const Book = require('../entities/book');
const Author = require('../entities/author');
const Publisher = require('../entities/publisher');
const router = express.Router();
const bookDao = require('../models/book-dao');
const authorDao = require('../models/author-dao');
const publisherDao = require('../models/publisher-dao');
const logger = require('../util/logger');
const moment = require('moment');

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
    body('date-published').custom(date => {
        const now = new Date().getTime();
        const published = new Date(date).getTime();

        if (published > now) {
            logger.logError(`Publication date ${date} is in the future`);
            throw new Error('Please enter a valid publication date, must be in the past - OK');
        } else {
            logger.logDebug(`Publication date ${date} is in the past`);
        }
    }),
    body('description').isLength({ min: 1, max: 250 }).withMessage('Please enter a valid description'),

], async (req, res) => {
    const errors = validationResult(req); // FIXME: {"errors":[{"value":"2021-07-15","msg":"Invalid value","param":"date-published","location":"body"}]}

    if (errors.isEmpty()) {
        const authorId = await authorDao.addAuthor(new Author(undefined, req.body.author));
        const publisherId = await publisherDao.addPublisher(new Publisher(undefined, req.body.publisher));

        const book = new Book(
            undefined,
            req.body.title,
            authorId,
            req.body.isbn,
            req.body.type,
            req.body.stock,
            req.body.language,
            req.body.pages,
            publisherId,
            req.body.datePublished,
            req.body.description,
            undefined, // imgurl
            req.body.price
        );

        logger.logDebug(JSON.stringify(book));

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