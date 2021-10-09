"use strict";

/************** IMPORTS *************/

require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const moment = require('moment');

// auth and session
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const userDao = require('./models/user-dao.js');
const cookieParser = require('cookie-parser');
const userType = require('./entities/constants/user-type.js');

// routes
const indexRouter = require('./routes/index.js');
const sessionsRouter = require('./routes/sessions.js');
const regiserRouter = require('./routes/register.js');
const profileRouter = require('./routes/profile.js');
const booksRouter = require('./routes/books.js');
const bookDetailsRouter = require('./routes/book-details.js');
const apiRouter = require('./routes/api.js');
const ordersRouter = require('./routes/orders.js');
const checkoutRouter = require('./routes/checkout.js');

/************** SETUP *************/

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// default variables for views
app.use((_req, _res, next) => {
    app.locals.moment = moment;
    app.locals.title = ''; // title of page
    app.locals.message = ''; // info message
    app.locals.errors = []; // error messages
    app.locals.active = ''; // active navbar link
    next();
});

/************** MIDDLEWARE *************/

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

// authentication

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (username, password, done) => {
    userDao.findUserByEmailAndPassword(username, password).then(({ user, check }) => {
        if (!user) {
            return done(null, false, { message: "Invalid username." });
        }
        if (!check) {
            return done(null, false, { message: "Invalid password." });
        }

        return done(null, user);
    });
}
));

// user object <-> session
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    userDao.findUserById(id).then(user => {
        done(null, user);
    });
});

// session

app.use(session({
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

// passport

app.use(passport.initialize());
app.use(passport.session());

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
};

/************** ROUTES *************/

app.use('/', sessionsRouter);
app.use('/', indexRouter);
app.use('/register', regiserRouter);
app.use('/profile', isLoggedIn, profileRouter);
app.use('/books', booksRouter);
app.use('/book-details', bookDetailsRouter);
app.use('/api', apiRouter);
app.use('/orders', ordersRouter);
app.use('/checkout', isLoggedIn, checkoutRouter);

app.use('/', (_req, _res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, _next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;