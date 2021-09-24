"use strict";

const db = require('../db');

const Address = require('../entities/address');

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
                reject(err);
            } else {
                resolve(this.lastID);
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

        db.get(query, id, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
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

        db.get(query, customer_id, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

module.exports = { addAddress, updateAddress, deleteAddress, findAddressById, findAddressByCustomerId };