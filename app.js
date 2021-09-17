"use strict";

/************** IMPORT *************/
import express, { json, urlencoded, static } from 'express';
import logger from 'morgan';
import { join } from 'path';
import indexRoutes from './routes/index';

import sqlite from 'sqlite3';

/************** INIT *************/

const app = express();
const port = 3000;

/************** MIDDLEWARE *************/

app.use(logger("dev"));
app.use(json());

app.use(urlencoded({extended: false}));
app.use(static(join(__dirname, "public")));

app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");

/************** ROUTES *************/

app.use('/', indexRoutes);

/************** STARTUP *************/
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

export default app;