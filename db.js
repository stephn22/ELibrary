"use strict"

const source = './elibrary.sqlite'

const sqlite = require('sqlite3'); // TODO: verbose?
const db = new sqlite.Database(source, 
(err) => { if (err) throw err; });

module.exports = db;