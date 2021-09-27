"use strict";

const db = require('../db');
const Publisher = require('../entities/publisher');
const logger = require('../util/logger');

/**
 * Add a publisher to the database.
 * @param {Publisher} publisher publisher to add
 * @returns {Promise<number>} id of the added publisher
 */
function addPublisher(publisher) {
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO publishers (name) VALUES (?)";

        db.run(query, [publisher.name], (err) => {
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
 * Update a publisher in the database.
 * @param {Publisher} publisher publisher to update
 * @returns {Promise<number>} id of the updated publisher
 */
function updatePublisher(publisher) {
    return new Promise((resolve, reject) => {
        const query = "UPDATE publishers SET name = ? WHERE id = ?";

        db.run(query, [publisher.name, publisher.id], (err) => {
            if (err) {
                logger.logError(err);
                reject(err);
            } else {
                resolve(publisher.id);
            }
        });
    });
}

/**
 * Delete a publisher from the database.
 * @param {number} id id of the publisher to delete
 * @returns {Promise<number>} id of the deleted publisher
 */
function deletePublisher(id) {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM publishers WHERE id = ?";

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
 * Find a publisher by id.
 * @param {number} id id of the publisher to find
 * @returns {Promise<Publisher>} publisher found
 */
function findPublisherById(id) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM publishers WHERE id = ?";

        db.get(query, [id], (err, row) => {
            if (err) {
                logger.logError(err);
                reject(err);
            } else if (row === undefined) {
                logger.logWarn(`Publisher with id ${id} not found`);
                resolve({ error: "No such publisher" });
            } else {
                resolve(new Publisher(row.id, row.name));
            }
        });
    });
}

/**
 * Return all publishers that match the given name.
 * @param {string} name name of the publisher to find
 * @returns {Promise<Publisher[]>} publishers found
 */
function findPublishersByName(name) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM publishers WHERE name LIKE ?";

        db.all(query, [`%${name}%`], (err, rows) => {
            if (err) {
                logger.logError(err);
                reject(err);
            } else if (rows.length === 0) {
                logger.logWarn(`Publishers with name ${name} not found`);
                resolve({ error: "No publishers found" });
            } else {
                resolve(rows.map((row) => new Publisher(row.id, row.name)));
            }
        });
    });
}

/**
 * Return all publishers in database as an array.
 * @returns {Promise<Publisher[]>} publishers found
 */
function findAllPublishers() {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM publishers";

        db.all(query, (err, rows) => {
            if (err) {
                logger.logError(err);
                reject(err);
            } else if (rows.length === 0) {
                logger.logWarn("No publishers found");
                resolve({ error: "No publishers found" });
            } else {
                resolve(rows.map((row) => new Publisher(row.id, row.name)));
            }
        });
    });
}

module.exports = { addPublisher, updatePublisher, deletePublisher, findPublisherById, findPublishersByName, findAllPublishers };