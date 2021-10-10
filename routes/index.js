"use strict";

const express = require('express');
const router = express.Router();
const featuresDao = require('../models/features-dao');
const bookDao = require('../models/book-dao');
const Features = require('../entities/features');
const logger = require('../util/logger');

router.get('/', async (req, res, _next) => {
    const features = await featuresDao.findAllFeatures();
    const books = await bookDao.findAllBooks();

    // fill feature properties
    features.forEach(feature => {
        books.forEach(book => {
            if (book.id === feature.book_id) {
                feature.book = book;
            }
        });
    });

    res.render('index', {
        user: req.user,
        features: features,
        books: books,
        styles: ['/stylesheets/index.css'],
        scripts: ['/javascripts/index.js']
    });
});

router.post('/features', async function (req, res, _next) {
    const firstBook = parseInt(req.body['first-book']);
    const secondBook = parseInt(req.body['second-book']);
    const thirdBook = parseInt(req.body['third-book']);

    const firstFeature = new Features(undefined, firstBook);
    const secondFeature = new Features(undefined, secondBook);
    const thirdFeature = new Features(undefined, thirdBook);

    // delete existing features
    await featuresDao.deleteAllFeatures();

    const fId = await featuresDao.addFeature(firstFeature);
    logger.logInfo(`Added feature with id ${fId}`);

    const sId = await featuresDao.addFeature(secondFeature);
    logger.logInfo(`Added feature with id ${sId}`);

    const tId = await featuresDao.addFeature(thirdFeature);
    logger.logInfo(`Added feature with id ${tId}`);

    const books = await bookDao.findAllBooks();
    const features = await featuresDao.findAllFeatures();

    // fill feature properties
    features.forEach(feature => {
        books.forEach(book => {
            if (book.id === feature.book_id) {
                feature.book = book;
            }
        });
    });

    res.render('index', {
        user: req.user,
        features: features,
        books: books,
        styles: ['/stylesheets/index.css'],
        scripts: ['/javascripts/index.js']
    });
});

module.exports = router;