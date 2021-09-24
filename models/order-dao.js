"use strict";

const db = require('../db.js');

const userDao = require('../models/user-dao');
const addressDao = require('../models/address-dao');

const Order = require('../entities/order');

// TODO: customer can order more than one book_id?

/**
 * Inserts a new order into the database.
 * @param {Order} order order to be inserted into database.
 * @returns {Promise.<number>} id of order that was inserted.
 */
function addOrder(order) {
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO orders (customer_id, date, book_id, price, address_id, status) VALUES (?, ?, ?, ?, ?, ?)";

        db.run(query, [
            order.customer_id,
            order.date,
            order.book_id,
            order.price,
            order.address_id,
            order.status], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID); // FIXME: this.lastID is undefined
                }
            });
    });
}

/**
 * Update an existing order in the database.
 * @param {Order} order order to be updated in database.
 * @returns {Promise.<number>} id of updated order.
 */
function updateOrder(order) {
    return new Promise((resolve, reject) => {
        const query = "UPDATE orders SET customer_id = ?, date = ?, book_id = ?, price = ?, address_id = ?, status = ? WHERE id = ?";

        db.run(query, [
            order.customer_id,
            order.date,
            order.book_id,
            order.price,
            order.address_id,
            order.status,
            order.id
        ], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(order.id);
            }
        });
    });
}

/**
 * Delete an existing order from the database.
 * @param {number} id id of order to be deleted.
 * @returns {Promise.<number>} id of deleted order.
 */
function deleteOrder(id) {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM orders WHERE id = ?";

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
 * Find an order by id.
 * @param {number} id id of order.
 * @returns {Promise.<number>} order.
 */
function findOrderById(id) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM orders WHERE id = ?";

        db.get(query, [id], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve({ error: "Order not found" });
            } else {
                const order = new Order(
                    row.id, 
                    row.customer_id, 
                    row.date, 
                    row.book_id, 
                    row.price, 
                    row.address_id, 
                    row.status);

                // fill properties with relative objects
                const user = await userDao.findUserById(row.customer_id);
                const address = await addressDao.findAddressById(row.address_id);

                order.customer = user;
                order.address = address;

                resolve(order);
            }
        });
    });
}

/**
 * Returns all orders in database as array.
 * @returns {Promise.<Order[]>} array of orders.
 */
function findAllOrders() {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM orders";

        db.all(query, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const orders = [];

                rows.forEach((row) => {
                    const order = new Order(
                        row.id, 
                        row.customer_id, 
                        row.date, 
                        row.book_id, 
                        row.price, 
                        row.address_id, 
                        row.status);

                    // fill properties with relative objects
                    let user = await userDao.findUserById(row.customer_id);
                    let address = await addressDao.findAddressById(row.address_id);

                    order.customer = user;
                    order.address = address;

                    orders.push(order);
                });

                resolve(orders);
            }
        });
    });
}

module.exports = { addOrder, updateOrder, deleteOrder, findOrderById, findAllOrders };