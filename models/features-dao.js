"use strict";

const db = require('../db');
const Feature = require('../entities/features');
const bookDao = require('./book-dao');
const logger = require('../util/logger');

/**
 * Add a new feature to the database.
 * @param {Feature} feature feature to add to database.
 * @returns {Promise<number>} id of the added feature.
 */
function addFeature(feature) {
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO features (book_id) VALUES (?)";

        db.run(query, [feature.book_id], function (err) {
            if (err) {
                logger.error(err);
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

/**
 * Update a feature in the database.
 * @param {Feature} feature feature to update.
 * @returns {Promise<number>} id of the updated feature.
 */
function updateFeature(feature) {
    return new Promise((resolve, reject) => {
        const query = "UPDATE features SET book_id = ? WHERE id = ?";

        db.run(query, [feature.book_id, feature.id], (err) => {
            if (err) {
                logger.error(err);
                reject(err);
            } else {
                resolve(feature.id);
            }
        });
    });
}

/**
 * Delete a feature from the database.
 * @param {number} id id of the feature to delete.
 * @returns {Promise<number>} id of the deleted feature.
 */
function deleteFeature(id) {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM features WHERE id = ?";

        db.run(query, [id], (err) => {
            if (err) {
                logger.error(err);
                reject(err);
            } else {
                resolve(id);
            }
        });
    });
}

/**
 * Delete all features from the database.
 * @returns {Promise<boolean>} true if all features were deleted
 */
function deleteAllFeatures() {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM features";

        db.run(query, (err) => {
            if (err) {
                logger.error(err);
                reject(err);
            } else {
                logger.logInfo("All features deleted");
                resolve(true);
            }
        });
    });
}

/**
 * Find a feature in the database.
 * @param {number} id id of the feature to get.
 */
function findFeatureById(id) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM features WHERE id = ?";

        db.get(query, [id], async function (err, row) {
            if (err) {
                logger.error(err);
                reject(err);
            } else if(row === undefined) {
                logger.logWarn("No such feature");
                resolve([]);
            } else {
                const feature = new Feature(row.id, row.book_id);

                // set properties
                const book = await bookDao.findBookById(feature.book_id);
                feature.book = book;

                resolve(feature);
            }
        });
    });
}

/**
 * Find all features in the database.
 * @returns {Promise<Feature[]>} all features in the database.
 */
function findAllFeatures() { // FIXME: not finding all features
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM features";

        db.all(query, async function (err, rows) {
            if (err) {
                logger.error(err);
                reject(err);
            } else if (rows === undefined) {
                logger.logWarn("No features found");
                resolve([]);
            } else {
                const features = [];
                rows.forEach(async function (row) {
                    const feature = new Feature(row.id, row.book_id);

                    let book = await bookDao.findBookById(feature.book_id);
                    feature.book = book;

                    features.push(feature);
                });
                resolve(features);
            }
        });
    });
}

module.exports = { addFeature, updateFeature, deleteFeature, deleteAllFeatures, findFeatureById, findAllFeatures };