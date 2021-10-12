"use strict";

const express = require("express");
const router = express.Router();
const userDao = require("../models/user-dao");
const logger = require("../util/logger");

router.get('/', async (req, res) => {
    const users = await userDao.findAllUsers();

    res.render('users', {
        user: req.user,
        users: users,
        styles: ['stylesheets/users.css'],
        scripts: ['javascripts/users.js']
    });
});

router.delete('/delete/:id', async (req, res) => {
    const id = parseInt(req.params.id); // user id
    const users = await userDao.findAllUsers();

    userDao.deleteUser(id)
    .then((_id) => {
        
        res.render('users', {
            user: req.user,
            users: users,
            message: "User deleted successfully",
            styles: ['stylesheets/users.css'],
            scripts: ['javascripts/users.js']
        });
    })
    .catch((err) => {
        logger.logError(err);

        res.render('users', {
            user: req.user,
            users: users,
            errors: [err],
            styles: ['stylesheets/users.css'],
            scripts: ['javascripts/users.js']
        });
    });
});

module.exports = router;