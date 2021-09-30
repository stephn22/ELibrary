"use strict";

const express = require('express');
const multer = require('multer');
const { check, validationResult } = require('express-validator');
const Book = require('../entities/book');
const router = express.Router();
const bookDao = require('../models/book-dao');
const logger = require('../util/logger');
const moment = require('moment');
const favouritesDao = require('../models/favourites-dao');
const bookType = require('../entities/constants/book-type');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

router.get('/', async (req, res, _next) => {
    const books = await bookDao.findAllBooks();

    const favourites = getFavourites(req.user);

    res.render('books', {
        user: req.user, books: books, favourites: favourites, styles: [
            '/stylesheets/books.css'
        ], scripts: ['/javascripts/books.js']
    });
});

router.post('/', upload.single('book-image'), async function (req, res, _next) {
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

    logger.logDebug(JSON.stringify(req.body));

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
            req.body['date-published'],
            req.body.description,
            req.file.buffer,
            req.body.price);

        bookDao.addBook(book)
            .then(async function (id) {
                logger.logInfo(`Added book with id: ${id}`);

                const books = await bookDao.findAllBooks();
                const favourites = getFavourites(req.user);

                res.render('books', {
                    user: req.user, errors: [`Error adding book: ${err}`], books: books, favourites: favourites, styles: [
                        '/stylesheets/books.css'
                    ], scripts: ['/javascripts/books.js']
                });
            })
            .catch(async (err) => {
                logger.logError(`Error adding book: ${err}`);

                const books = await bookDao.findAllBooks();
                const favourites = getFavourites(req.user);

                res.render('books', {
                    user: req.user, errors: [`Error adding book: ${err}`], books: books, favourites: favourites, styles: [
                        '/stylesheets/books.css'
                    ], scripts: ['/javascripts/books.js']
                });
            });
    } else {
        logger.logError(`Book not added: ${JSON.stringify(errors)}`);

        const books = await bookDao.findAllBooks();
        const favourites = getFavourites(req.user);

        res.render('books', {
            user: req.user, books: books, favourites: favourites, styles: [
                '/stylesheets/books.css'
            ], scripts: ['/javascripts/books.js'], errors: errors.array()
        });
    }
});

router.delete('/:id', async function (req, res) {
    const bookId = req.params.id;

    await bookDao.deleteBook(parseInt(bookId));
    logger.logInfo(`Deleted book with id: ${bookId}`);

    const books = await bookDao.findAllBooks();
    const favourites = getFavourites(req.user);

    res.render('books', {
        user: req.user, books: books, favourites: favourites, message: "Book successfully deleted", styles: [
            '/stylesheets/books.css'
        ], scripts: ['/javascripts/books.js']
    });
});

/**
 * Get favourites of user if logged in
 * @param {User} user user
 * @returns {Favourites} returns the Favourites object if logged in, favourites of user, otherwise undefined
 */
async function getFavourites(user) {
    if (user) {
        return await favouritesDao.findFavouritesByUserId(user.id);
    } else {
        return undefined;
    }
}

module.exports = router;