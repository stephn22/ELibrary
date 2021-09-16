"use strict";

/************** IMPORT *************/
const express = require('express');
const logger = require('morgan');
const path = require('path');
const indexRoutes = require('./routes/index');

const sqlite = require('sqlite3');

/************** INIT *************/

const app = express();
const port = 3000;

/************** MIDDLEWARE *************/

app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/************** ROUTES *************/

app.use('/', indexRoutes);

/************** STARTUP *************/
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

module.exports = app;