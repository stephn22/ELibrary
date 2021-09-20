"use strict";

const now = require('./time');
const colors = require('colors');

/**
 * Logs a debug message to the console.
 * @param {string} msg message to log
 */
function logDebug(msg) {
    console.log(`[${now().bgWhite}] DEBUG: ${msg}`.gray);
}

/**
 * Logs an info message to the console.
 * @param {string} msg message to log
 */
function logInfo(msg) {
    console.log(`[${now().bgWhite}] INFO: ${msg}`.white);
}

/**
 * Logs a warning message to the console.
 * @param {string} msg message to log
 */
function logWarn(msg) {
    console.log(`[${now().bgYellow}] WARN: ${msg}`.yellow);
}

/**
 * Logs an error message to the console.
 * @param {string} msg message to log
 */
function logError(msg) {
    console.log(`[${now().bgRed}] ERROR: ${msg}`.red);
}

module.exports = { logDebug, logInfo, logWarn, logError };