"use strict";

const db = require('../db.js');
const userDao = require('../models/user-dao');
const bookDao = require('../models/book-dao');
const Order = require('../entities/order');
const Book = require('../entities/book');
const orderType = require('../entities/constants/order-type');
const logger = require('../util/logger');

/**
 * Inserts a new order into the database.
 * @param {Order} order order to be inserted into database.
 * @param {[{book: Book, quantity: number}]} items array of items to be inserted into database.
 * @returns {Promise<number>} id of order that was inserted.
 */
function addOrder(order, items) {
    return new Promise(async function (resolve, reject) {
        const query = "INSERT INTO orders (customer_id, date, price, type) VALUES (?, ?, ?, ?)";

        db.run(query, [
            order.customerId,
            new Date(order.date).getTime(),
            order.price,
            order.type], async function (err) {
                if (err) {
                    logger.logError(err);
                    reject(err);
                } else {
                    const id = this.lastID;

                    if (order.type === orderType.RESERVATION) {
                        const book = await bookDao.findBookById(items[0].book.id);

                        book.isReserved = true;

                        await bookDao.updateBook(book);
                    }

                    // user can reserve only 1 book at a time
                    const query = "INSERT INTO order_items (order_id, book_id, quantity) VALUES (?, ?, ?)";

                    db.run(query, [
                        id,
                        items[0].book.id,
                        items[0].quantity], function (err) {
                            if (err) {
                                logger.logError(err);
                                reject(err);
                            } else {
                                logger.logInfo(`Inserted order item with id ${this.lastID}`);
                            }
                        });

                    resolve(id);
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
        const query = "UPDATE orders SET customer_id = ?, date = ?, price = ?, type = ?, WHERE id = ?";

        db.run(query, [
            order.customerId,
            new Date(order.date).getTime(),
            order.price,
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
                    row.price,
                    row.type);

                // fill properties with relative objects
                const user = await userDao.findUserById(row.customer_id);

                const query = "SELECT * FROM order_items WHERE order_id = ?";

                db.all(query, [id], async function (err, rows) {
                    if (err) {
                        logger.logError(err);
                        reject(err);
                    } else {
                        order.customer = user;
                        order.items = [];

                        for (const row of rows) {
                            const book = await bookDao.findBookById(row.book_id);
                            order.items.push({
                                book: book,
                                quantity: row.quantity
                            });
                        }

                        resolve(order);
                    }
                });
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
        const query = "SELECT * FROM orders WHERE customer_id = ? ORDER BY id";

        db.all(query, [customerId], function (err, rows) {
            if (err) {
                logger.logError(err);
                reject(err);
            } else if (rows === undefined) {
                logger.logWarn(`No orders for customer with id: ${customerId}`);
                resolve([]);
            } else {
                const orders = [];

                rows.forEach(async (row) => {
                    const order = new Order(
                        row.id,
                        row.customer_id,
                        new Date(row.date).toDateString(),
                        row.price,
                        row.type);

                    // fill properties with relative objects
                    let user = await userDao.findUserById(row.customer_id);

                    const query = "SELECT * FROM order_items WHERE order_id = ?";

                    db.all(query, [row.id], async function (err, rows) {
                        if (err) {
                            logger.logError(err);
                            reject(err);
                        } else {
                            order.customer = user;
                            order.items = [];

                            for (const r of rows) {
                                const book = await bookDao.findBookById(r.book_id);
                                order.items.push({
                                    book: book,
                                    quantity: r.quantity
                                });

                                orders.push(order);
                            }
                            resolve(orders);
                        }
                    });
                });
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
        const query = "SELECT * FROM orders ORDER BY id";

        db.all(query, function (err, rows) {
            if (err) {
                logger.logError(err);
                reject(err);
            } else if (rows === undefined) {
                logger.logWarn("No orders found");
                resolve([]);
            }
            else {
                const orders = [];

                rows.forEach(async (row) => {
                    const order = new Order(
                        row.id,
                        row.customer_id,
                        new Date(row.date).toDateString(),
                        row.price,
                        row.type);

                    // fill properties with relative objects
                    let user = await userDao.findUserById(row.customer_id);

                    const query = "SELECT * FROM order_items WHERE order_id = ?";

                    db.all(query, [row.id], async function (err, r) {
                        if (err) {
                            logger.logError(err);
                            reject(err);
                        } else {
                            order.customer = user;
                            order.items = [];

                            for (const w of r) {
                                const book = await bookDao.findBookById(w.book_id);
                                order.items.push({
                                    book: book,
                                    quantity: w.quantity
                                });

                                orders.push(order);
                            }
                            resolve(orders);
                        }
                    });
                });
            }
        });
    });
}

module.exports = { addOrder, updateOrder, deleteOrder, findOrderById, findOrdersByCustomerId, findAllOrders };