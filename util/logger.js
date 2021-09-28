"use strict";

const now = require('./time');
const colors = require('colors');

/**
 * Logs a debug message to the console.
 * @param {string} msg message to log
 */
function logDebug(msg) {
    console.debug(`[${now().black.bgWhite}] DEBUG: ${msg}`.gray);
}

/**
 * Logs an info message to the console.
 * @param {string} msg message to log
 */
function logInfo(msg) {
    console.info(`[${now().black.bgWhite}] INFO: ${msg}`.white);
}

/**
 * Logs a warning message to the console.
 * @param {string} msg message to log
 */
function logWarn(msg) {
    console.warn(`[${now().white.bgYellow}] WARN: ${msg}`.yellow);
}

/**
 * Logs an error message to the console.
 * @param {string} msg message to log
 */
function logError(msg) {
    console.error(`[${now().white.bgRed}] ERROR: ${msg}`.red);
}

module.exports = { logDebug, logInfo, logWarn, logError };