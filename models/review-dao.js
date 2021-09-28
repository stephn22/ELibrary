"use strict";

const db = require('../db.js');
const userDao = require('../models/user-dao');
const bookDao = require('../models/book-dao');
const Review = require('../entities/review');
const logger = require('../util/logger');

/**
 * Inserts a new review into the database.
 * @param {Review} review review to be inserted
 * @returns {Promise<number>} id of the inserted review
 */
function addReview(review) {
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO reviews (customer_id, date, book_id, text, rating) VALUES (?, ?, ?, ?, ?)";

        db.run(query, [
            review.customer_id,
            new Date(review.date).getTime(),
            review.book_id,
            review.text,
            review.rating
        ], function (err) {
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
 * Updates a review in the database.
 * @param {Review} review review to update
 * @returns {Promise<number>} id of the updated review
 */
function updateReview(review) {
    return new Promise((resolve, reject) => {
        const query = "UPDATE reviews SET customer_id = ?, date = ?, book_id = ?, text = ?, rating = ? WHERE id = ?";

        db.run(query, [
            review.customer_id,
            new Date(review.date).getTime(),
            review.book_id,
            review.text,
            review.rating,
            review.id
        ], (err) => {
            if (err) {
                logger.logError(err);
                reject(err);
            } else {
                resolve(review.id);
            }
        });
    });
}

/**
 * Delete a review from the database.
 * @param {number} id id of the review to delete
 * @returns {Promise<number>} id of the deleted review
 */
function deleteReview(id) {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM reviews WHERE id = ?";

        db.run(query, [id], (err) => {
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
 * Finds a review by its id.
 * @param {number} id id of the review to find
 * @returns {Promise<Review>} review.
 */
function findReviewById(id) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM reviews WHERE id = ?";

        db.get(query, [id], async (err, row) => {
            if (err) {
                logger.logError(err);
                reject(err);
            } else if (row === undefined) {
                logger.logWarn(`No such review with id: ${id}`);
                resolve({ error: "Review not found" });
            } else {
                const review = new Review(
                    row.id,
                    row.customer_id,
                    new Date(row.date).toDateString(),
                    row.book_id,
                    row.text,
                    row.rating);

                // fill properties of review
                const user = await userDao.findUserById(row.customer_id);
                const book = await bookDao.findBookById(row.book_id);

                review.customer = user;
                review.book = book;

                resolve(review);
            }
        });
    });
}

/**
 * Find all reviews of a customer.
 * @param {number} customer_id id of customer that made the review/s
 * @returns {Promise<Review[]>} reviews of the customer.
 */
function findReviewsByCustomerId(customer_id) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM reviews WHERE customer_id = ?";

        db.all(query, [customer_id], (err, rows) => {
            if (err) {
                logger.logError(err);
                reject(err);
            } else if (rows === undefined) {
                logger.logWarn(`No such reviews with customer id: ${customer_id}`);
                resolve({ error: "No such reviews with that customer id" });
            } else {
                const reviews = [];

                rows.forEach(async (row) => {
                    const review = new Review(
                        row.id,
                        row.customer_id,
                        new Date(row.date).toDateString(),
                        row.book_id,
                        row.text,
                        row.rating);

                    let user = await userDao.findUserById(row.customer_id);
                    let book = await bookDao.findBookById(row.book_id);

                    review.customer = user;
                    review.book = book;

                    reviews.push(review);
                });

                resolve(reviews);
            }
        });
    });
}

/**
 * Returns all reviews in database as array.
 * @returns {Promise<Review[]>} array of reviews.
 */
function findAllReviews() {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM reviews";

        db.all(query, (err, rows) => {
            if (err) {
                logger.logError(err);
                reject(err);
            } else if (rows === undefined) {
                logger.logWarn("No reviews found");
                resolve({ error: "No reviews found" });
            } else {
                const reviews = [];

                rows.forEach(async (row) => {
                    const review = new Review(
                        row.id,
                        row.customer_id,
                        new Date(row.date).toDateString(),
                        row.book_id,
                        row.text,
                        row.rating);

                    // fill properties of review
                    let user = await userDao.findUserById(row.customer_id);
                    let book = await bookDao.findBookById(row.book_id);

                    review.customer = user;
                    review.book = book;

                    reviews.push(review);
                });

                resolve(reviews);
            }
        });
    });
}

module.exports = { addReview, updateReview, deleteReview, findReviewById, findReviewsByCustomerId, findAllReviews };