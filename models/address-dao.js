"use strict";

const db = require('../db');
const userDao = require('../models/user-dao');
const Address = require('../entities/address');
const logger = require('../util/logger');

/**
 * Add address to the database.
 * @param {Address} address address to add
 * @returns {Promise<number>} id of address inserted
 */
function addAddress(address) {
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO addresses (customer_id, placename) VALUES (?, ?)";

        db.run(query, [address.customer_id, address.placename], (err) => {
            if (err) {
                logger.logError(err);
                reject(err);
            } else {
                resolve(this.lastID); // FIXME: this.lastID is undefined
            }
        });
    });
}

/**
 * Update an existing address.
 * @param {Address} address address to update
 * @returns {Promise<number>} id of address updated
 */
function updateAddress(address) {
    return new Promise((resolve, reject) => {
        const query = "UPDATE addresses SET customer_id = ?, placename = ? WHERE id = ?";

        db.run(query, [
            address.customerId,
            address.placename,
            address.id], (err) => {
                if (err) {
                    logger.logError(err);
                    reject(err);
                } else {
                    resolve(address.id);
                }
            });
    });
}

/**
 * Delete an address (by id).
 * @param {number} id id of address to delete
 * @returns {Promise<number>} id of address deleted
 */
function deleteAddress(id) {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM addresses WHERE id = ?";

        db.run(query, [id], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(id);
            }
        });
    });
}

/**
 * Find an address by id.
 * @param {number} id 
 * @returns {Promise<Address>} address found
 */
function findAddressById(id) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM addresses WHERE id = ?";

        db.get(query, id, async (err, row) => {
            if (err) {
                logger.logError(err);
                reject(err);
            } else if (row === undefined) {
                logger.logWarn(`No such address with id: ${id}`);
                reject({ error: "Address not found" });
            } else {
                const address = new Address(
                    row.id,
                    row.customer_id,
                    row.placename);

                // fill the customer property of address
                const user = await userDao.findUserById(row.customer_id);
                address.customer = user;

                resolve(address);
            }
        });
    });
}

/**
 * Find an address by customer id.
 * @param {number} customer_id 
 * @returns {Promise<Address>} address found
 */
function findAddressByCustomerId(customer_id) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM addresses WHERE customer_id = ?";

        db.get(query, customer_id, async (err, row) => {
            if (err) {
                logger.logError(err);
                reject(err);
            } else if (row === undefined) {
                logger.logWarn(`No such address with customer_id: ${customer_id}`);
                reject({ error: "Address not found" });
            } else {
                const address = new Address(
                    row.id,
                    row.customer_id,
                    row.placename);

                // fill the customer property of address
                const user = await userDao.findUserById(row.customer_id);
                address.customer = user;

                resolve(address);
            }
        });
    });
}

module.exports = { addAddress, updateAddress, deleteAddress, findAddressById, findAddressByCustomerId };