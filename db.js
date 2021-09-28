"use strict";

const source = './elibrary.db';

const sqlite = require('sqlite3');

const db = new sqlite.Database(source, 
(err) => { if (err) throw err; });

module.exports = db;