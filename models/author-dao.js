"use strict";

const db = require('../db');
const Author = require('../entities/author');
const logger = require('../util/logger');

/**
 * Add author to database
 * @param {Author} author author to add
 * @returns {Promise<number>} id of added author
 */
function addAuthor(author) {
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO authors (name) VALUES (?)";

        db.run(query, [author.name], (err) => {
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
 * Update an author in database
 * @param {Author} author author to update
 * @returns {Promise<number>} id of updated author
 */
function updateAuthor(author) {
    return new Promise((resolve, reject) => {
        const query = "UPDATE authors SET name = ? WHERE id = ?";

        db.run(query, [author.name, author.id],
            (err) => {
                if (err) {
                    logger.logError(err);
                    reject(err);
                } else {
                    resolve(author.id);
                }
            });
    });
}

/**
 * Delete an author from database
 * @param {number} id id of author to delete
 * @returns {Promise<number>} id of deleted author
 */
function deleteAuthor(id) {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM authors WHERE id = ?";

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
 * Find author by id
 * @param {number} id id of author to find
 * @returns {Promise<Author>} author found
 */
function findAuthorById(id) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM authors WHERE id = ?";

        db.get(query, [id], (err, row) => {
            if (err) {
                logger.logError(err);
                reject(err);
            } else if (row === undefined) {
                logger.logWarn(`Author with id ${id} not found`);
                resolve({ error: "No such author" });
            } else {
                resolve(new Author(row.id, row.name));
            }
        });
    });
}

/**
 * Return all authors that match the given name
 * @param {string} name name of author to find
 * @returns {Promise<Author[]>} authors found
 */
function findAuthorsByName(name) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM authors WHERE name LIKE ?";

        db.all(query, [`%${name}%`], (err, rows) => {
            if (err) {
                logger.logError(err);
                reject(err);
            } else if (rows === undefined) {
                logger.logWarn(`No authors found with name ${name}`);
                resolve({ error: "No authors found" });
            } else {
                const authors = rows.map(row => new Author(row.id, row.name));
                resolve(authors);
            }
        });
    });
}

/**
 * Return all authors in database as an array
 * @returns {Promise<Author[]>} authors found
 */
function findAllAuthors() {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM authors";

        db.all(query, (err, rows) => {
            if (err) {
                logger.logError(err);
                reject(err);
            } else if (rows === undefined) {
                logger.logWarn("No authors found");
                resolve({ error: "No authors found" });
            } else {
                const authors = rows.map(row => new Author(row.id, row.name));

                resolve(authors);
            }
        });
    });
}

module.exports = { addAuthor, updateAuthor, deleteAuthor, findAuthorById, findAuthorsByName, findAllAuthors };