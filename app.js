"use strict";

/************** IMPORT *************/

import createError from "http-errors";
import express, { json, urlencoded, static } from 'express';
import session from 'express-session';
import moment from 'moment';
import logger from 'morgan';
import passport from 'passport';
import { join } from 'path';
import { Strategy as LocalStrategy } from 'passport-local';

import sqlite from 'sqlite3';

const userDao = require('./models/user-dao.js');

// routes
const indexRouter = require('./routes/index.js').default;
const sessionsRouter = require('./routes/sessions.js').default;


/************** INIT *************/

const app = express();
const port = 3000;

/************** MIDDLEWARE *************/

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
// TODO: cookieParser

app.use(static(join(__dirname, "public")));

app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");

// default variables for views
app.use((_req, _res, next) => {
    app.locals.moment = moment;
    app.locals.title = '';
    app.locals.message = '';
    app.locals.active = '';
    next();
});

// authentication

passport.use(new LocalStrategy(
    function (email, password, done) {
        userDao.getUserByEmailAndPassword(email, password).then(({ user, check }) => {
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
    userDao.getUserById(id).then(({ user }) => {
        done(null, user);
    });
});

// session

app.use(session({
    //store: new FileStore(), // by default, Passport uses a MemoryStore to keep track of the sessions - if you want to use this, launch nodemon with the option: --ignore sessions/
    secret: "secret", // TODO: change this
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

app.use('/', indexRouter);
app.use("/", sessionsRouter);

app.use("/", (_req, _res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // error page
    res.status(err.status || 500);
    res.render("error");
});

/************** STARTUP *************/
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

export default app;