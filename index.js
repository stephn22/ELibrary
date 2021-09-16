/************** IMPORT *************/
const express = require('express');
const morgan = require('morgan');

const sqlite = require('sqlite3');

/************** INIT *************/
const app = express();
const port = 3000;

/************** MIDDLEWARE *************/
app.use(morgan('tiny'));

/************** ROUTES *************/

app.get('/', (req, res) => res.send('Hello World!'));
// TODO: add routes

/************** STARTUP *************/
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});