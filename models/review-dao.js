"use strict";

const db = require('../db.js').default;

const Review = require('../entities/review');

/**
 * Inserts a new review into the database.
 * @param {Review} review review to be inserted
 * @returns {Promise.<number>} id of the inserted review
 */
exports.addReview = function(review) {
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO reviews (customer_id, date, book_id, text, rating) VALUES (?, ?, ?, ?, ?)";

        db.run(query, [
            review.customer_id,
            review.date,
            review.book_id,
            review.text,
            review.rating
        ], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(review.id);
            }
        });
    });
}

/**
 * Updates a review in the database.
 * @param {Review} review review to update
 * @returns {Promise.<number>} id of the updated review
 */
exports.updateReview = function(review) {
    return new Promise((resolve, reject) => {
        const query = "UPDATE reviews SET customer_id = ?, date = ?, book_id = ?, text = ?, rating = ? WHERE id = ?";

        db.run(query, [
            review.customer_id,
            review.date,
            review.book_id,
            review.text,
            review.rating,
            review.id
        ], (err) => {
            if (err) {
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
 * @returns {Promise.<number>} id of the deleted review
 */
exports.deleteReview = function(id) {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM reviews WHERE id = ?";

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
 * Finds a review by its id.
 * @param {number} id id of the review to find
 * @returns {Promise.<Review>} review.
 */
exports.getReviewById = function(id) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM reviews WHERE id = ?";

        db.get(query, [id], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve({ error: "Review not found" });
            } else {
                const review = new Review(
                    row.id,
                    row.customer_id,
                    row.date,
                    row.book_id,
                    row.text,
                    row.rating);

                resolve(review);
            }
        });
    });
}

/**
 * Find review by customer id.
 * @param {number} customer_id id of customer that made the review
 * @returns {Promise.<Review>} review.
 */
exports.getReviewByCustomerId = function(customer_id) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM reviews WHERE customer_id = ?";

        db.get(query, [customer_id], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve({ error: "Review not found" });
            } else {
                const review = new Review(
                    row.id,
                    row.customer_id,
                    row.date,
                    row.book_id,
                    row.text,
                    row.rating);

                resolve(review);
            }
        });
    });
}

/**
 * Returns all reviews in database as array.
 * @returns {Promise.<Review[]>} array of reviews.
 */
exports.getAllReviews = function() {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM reviews";

        db.all(query, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const reviews = [];

                rows.forEach((row) => {
                    const review = new Review(
                        row.id,
                        row.customer_id,
                        row.date,
                        row.book_id,
                        row.text,
                        row.rating);

                    reviews.push(review);
                });

                resolve(reviews);
            }
        });
    });
}