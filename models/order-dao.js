"use strict";

const db = require('../db.js');
const userDao = require('../models/user-dao');
const bookDao = require('../models/book-dao');
const Order = require('../entities/order');
const logger = require('../util/logger');

// TODO: customer can order more than one book?

/**
 * Inserts a new order into the database.
 * @param {Order} order order to be inserted into database.
 * @returns {Promise<number>} id of order that was inserted.
 */
function addOrder(order) {
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO orders (customer_id, date, book_id, price, status, type) VALUES (?, ?, ?, ?, ?, ?)";

        db.run(query, [
            order.customer_id,
            new Date(order.date).getTime(),
            order.book_id,
            order.price,
            order.address,
            order.status,
            order.type], function (err) {
                if (err) {
                    logger.logError(err);
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
    });
}

/**
 * Update an existing order in the database.
 * @param {Order} order order to be updated in database.
 * @returns {Promise<number>} id of updated order.
 */
function updateOrder(order) {
    return new Promise((resolve, reject) => {
        const query = "UPDATE orders SET customer_id = ?, date = ?, book_id = ?, price = ?, address = ?, status = ?, type = ?, WHERE id = ?";

        db.run(query, [
            order.customer_id,
            new Date(order.date).getTime(),
            order.book_id,
            order.price,
            order.address,
            order.status,
            order.type,
            order.id
        ], function (err) {
            if (err) {
                logger.logError(err);
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
 * @returns {Promise<number>} id of deleted order.
 */
function deleteOrder(id) {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM orders WHERE id = ?";

        db.run(query, [id], function (err) {
            if (err) {
                logger.logError(err);
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
 * @returns {Promise<number>} order.
 */
function findOrderById(id) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM orders WHERE id = ?";

        db.get(query, [id], async function (err, row) {
            if (err) {
                logger.logError(err);
                reject(err);
            } else if (row === undefined) {
                logger.logWarn(`No such order with id: ${id}`);
                resolve({ error: "Order not found" });
            } else {
                const order = new Order(
                    row.id,
                    row.customer_id,
                    new Date(row.date).toDateString(),
                    row.book_id,
                    row.price,
                    row.address,
                    row.status,
                    row.type);

                // fill properties with relative objects
                const user = await userDao.findUserById(row.customer_id);

                order.customer = user;

                resolve(order);
            }
        });
    });
}

/**
 * Find all orders for a customer.
 * @param {number} customerId id of customer.
 * @returns {Promise<Order[]>} array of orders.
 */
function findOrdersByCustomerId(customerId) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM orders WHERE customer_id = ?";

        db.run(query, [customerId], function (err, rows) {
            if (err) {
                logger.logError(err);
                reject(err);
            } else if (rows === undefined) {
                logger.logWarn(`No orders for customer with id: ${customerId}`);
                resolve({ error: "No orders found" });
            } else {
                const orders = [];

                rows.forEach(async (row) => {
                    const order = new Order(
                        row.id,
                        row.customer_id,
                        new Date(row.date).toDateString(),
                        row.book_id,
                        row.price,
                        row.address,
                        row.status);

                    // fill properties with relative objects
                    let user = await userDao.findUserById(row.customer_id);
                    let book = await bookDao.findBookById(row.book_id);

                    order.customer = user;
                    order.book = book;

                    orders.push(order);
                });

                resolve(orders);
            }
        });
    });
}

/**
 * Returns all orders in database as array.
 * @returns {Promise<Order[]>} array of orders.
 */
function findAllOrders() {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM orders";

        db.all(query, function (err, rows) {
            if (err) {
                logger.logError(err);
                reject(err);
            } else if (rows === undefined) {
                logger.logWarn("No orders found");
                resolve({ error: "No orders found" });
            }
            else {
                const orders = [];

                rows.forEach(async (row) => {
                    const order = new Order(
                        row.id,
                        row.customer_id,
                        new Date(row.date).toDateString(),
                        row.book_id,
                        row.price,
                        row.address,
                        row.status);

                    // fill properties with relative objects
                    let user = await userDao.findUserById(row.customer_id);

                    order.customer = user;

                    orders.push(order);
                });

                resolve(orders);
            }
        });
    });
}

module.exports = { addOrder, updateOrder, deleteOrder, findOrderById, findOrdersByCustomerId, findAllOrders };