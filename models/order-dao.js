"use strict";

const db = require('../db');

import { Order } from '../entities/order.js';

// TODO: customer can order more than one book?

/**
 * Inserts a new order into the database.
 * @param {Order} order to be inserted into database.
 * @returns {Promise.<Order>} order that was inserted.
 */
export function addOrder(order) {
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO orders (customer, date, book, price, address, status) VALUES (?, ?, ?, ?, ?, ?)";

        db.query(query, [
            order.customer,
            order.date,
            order.book,
            order.price,
            order.address,
            order.status], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.id);
                }
            });
    });
}

/**
 * Update an existing order in the database.
 * @param {Order} order to be updated in database.
 * @returns {Promise.<number>} id of updated order.
 */
export function updateOrder(order) {
    return new Promise((resolve, reject) => {
        const query = "UPDATE orders SET customer = ?, date = ?, book = ?, price = ?, address = ?, status = ? WHERE id = ?";

        db.query(query, [
            order.customer,
            order.date,
            order.book,
            order.price,
            order.address,
            order.status,
            order.id
        ], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(this.id);
            }
        });
    });
}

/**
 * Delete an existing order from the database.
 * @param {number} id of order to be deleted.
 * @returns {Promise.<number>} id of deleted order.
 */
export function deleteOrder(id) {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM orders WHERE id = ?";

        db.run(query, [id], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(this.id);
            }
        });
    });
}

/**
 * Find an order by id.
 * @param {number} id of order.
 * @returns {Promise.<number>} order.
 */
export function getOrderById(id) {
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
                    row.customer, 
                    row.date, 
                    row.book, 
                    row.price, 
                    row.address, 
                    row.status);

                resolve(order);
            }
        });
    });
}

/**
 * Returns all orders in database as array.
 * @returns {Promise.<Order[]>} all orders.
 */
export function getAllOrders() {
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
                        row.customer, 
                        row.date, 
                        row.book, 
                        row.price, 
                        row.address, 
                        row.status);

                    orders.push(order);
                });

                resolve(orders);
            }
        });
    });
}