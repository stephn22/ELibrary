"use strict";

const express = require('express');
const router = express.Router();
const logger = require('../util/logger');
const favouritesDao = require('../models/favourites-dao');

router.get('/favourites', async function (req, res) {

    const user = req.user;

    const favourites = await favouritesDao.findFavouritesByUserId(user.id);

    res.render('favourites', {
        user: user, favourites: favourites}); // TODO: styles etc.
});

router.post('/:userId', async (req, res, next) => {
    const json = req.body;
    const userId = parseInt(req.params.userId);

    const bookId = JSON.parse(json);

    const id = await favouritesDao.addFavourite(userId, bookId);
    logger.logInfo(`Added favourite with id: ${id}`);
});

module.exports = router;