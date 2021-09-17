"use strict"

const source = './elibrary.sqlite'

import { Database } from 'sqlite3'; // TODO: verbose?
const db = new Database(source, 
(err) => { if (err) throw err; });

export default db;