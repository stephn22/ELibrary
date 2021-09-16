"use strict"

const source = './elibrary.sqlite'

const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database(source, 
(err) => { if (err) throw err; });

module.exports = db;