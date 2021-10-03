"use strict";

const db = require('../db');
const bookDao = require('./book-dao');
const Favourites = require('../entities/favourites');
const logger = require('../util/logger');

/**
 * Add a book to the favourite list
 * @param {number} userId id of user
 * @param {number} bookId id of book
 * @returns {Promise<number>} id of favourite item inserted
 */
function addFavourite(userId, bookId) {
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO favourite_items (user_id, book_id) VALUES (?, ?)";

        db.run(query, [
            userId,
            bookId
        ],
            function (err) {
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
 * Update an existing favouite item in the database
 * @param {number} id id of favourite item
 * @param {number} bookId id of book
 * @returns {Promise<number>} id of updated favourite item
 */
function updateFavourite(id, bookId) {
    return new Promise((resolve, reject) => {
        const query = "UPDATE favourite_items SET book_id = ? WHERE id = ?";

        db.run(query, [bookId, id], function (err) {
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
 * Delete an existing favourite item from the database
 * @param {number} id id of favourite item to be deleted
 * @returns {Promise<number>} id of deleted favourite item
 */
function deleteFavourite(id) {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM favourite_items WHERE id = ?";

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
 * Returns all favourites for a user
 * @param {number} userId id of user
 * @returns {Promise<Favourites>} favourites for user
 */
function findFavouritesByUserId(userId) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM favourite_items where user_id = ?";

        db.run(query, [userId], function (err, rows) {
            if (err) {
                logger.logError(err);
                reject(err);
            } else if (rows === undefined) {
                logger.logWarn(`No favourites for customer with id: ${userId}`);
                resolve({ error: "No favourites found" });
            } else {
                const favourites = new Favourites(userId);

                rows.forEach(async function (row) {
                    let book = await bookDao.findBookById(row.book_id);

                    favourites.addItem(book);
                });
                resolve(favourites);
            }
        });
    });
}

module.exports = { addFavourite, updateFavourite, deleteFavourite, findFavouritesByUserId };