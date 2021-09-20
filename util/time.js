"use strict";

const moment = require('moment');

/**
 * Returns a string representing the current time
 * @returns {string} current time
 */
function now(){
    return moment().format();
}

module.exports = now;