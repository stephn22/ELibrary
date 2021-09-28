"use strict";

const db = require('../db');
const Book = require('../entities/book');
const authorDao = require('../models/author-dao');
const publisherDao = require('../models/publisher-dao');
const logger = require('../util/logger');

/**
 * Add book to database.
 * @param {Book} book book to add to database
 * @returns {Promise<number>} id of book.
 */
function addBook(book) {
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO books (title, author_id, isbn, type, stock, language, pages, publisher_id, datePub, description, imgUrl, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        db.run(query, [
            book.title,
            book.author_id,
            book.isbn,
            book.type,
            book.stock,
            book.language,
            book.pages,
            book.publisher_id,
            new Date(book.datePub).getTime(),
            book.description,
            book.imgUrl,
            book.price], function (err) {
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
 * Update a book in database.
 * @param {Book} book book to be updated
 * @returns {Promise<number>} id of updated book.
 */
function updateBook(book) {
    return new Promise((resolve, reject) => {
        const query = "UPDATE books SET title = ?, author_id = ?, isbn = ?, type = ?, stock = ?, language = ?, pages = ?, publisher_id = ?, datePub = ?, description = ?, imgUrl = ?, price = ? WHERE id = ?";

        db.run(query, [
            book.title,
            book.author_id,
            book.isbn,
            book.type,
            book.stock,
            book.language,
            book.pages,
            book.publisher_id,
            new Date(book.datePub).getTime(),
            book.description,
            book.imgUrl,
            book.price,
            book.id], function (err) {
                if (err) {
                    logger.logError(err);
                    reject(err);
                } else {
                    resolve(book.id);
                }
            });
    });
}

/**
 * Delete a book from database.
 * @param {number} id id of book.
 * @returns {Promise<number>} id of deleted book.
 */
function deleteBook(id) {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM books WHERE id = ?";

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
 * Find book by id.
 * @param {number} id id of book.
 * @returns {Promise<Book>} book.
 */
function findBookById(id) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM books WHERE id = ?";

        db.get(query, [id], async function (err, row) {
            if (err) {
                logger.logError(err);
                reject(err);
            } else if (row === undefined) {
                logger.logWarn(`Book with id ${id} not found`);
                resolve({ error: "No such book" });
            } else {
                const book = new Book(
                    row.id,
                    row.title,
                    row.author_id,
                    row.isbn,
                    row.type,
                    row.stock,
                    row.language,
                    row.pages,
                    row.publisher,
                    new Date(row.datePub).toDateString(),
                    row.description,
                    row.imgUrl,
                    row.price);

                // fill properties
                const author = await authorDao.findAuthorById(row.author_id);
                book.author = author;

                const publisher = await publisherDao.findPublisherById(row.publisher_id);
                book.publisher = publisher;

                resolve(book);
            }
        });
    });
}

/**
 * Return all books in database as array.
 * @returns {Promise<Book[]>} array of books.
 */
function findAllBooks() {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM books";

        db.all(query, function (err, rows) {
            if (err) {
                logger.logError(err);
                reject(err);
            } else if (rows === undefined) {
                logger.logWarn("No books found");
                resolve({ error: "No books found" });
            } else {
                const books = [];

                rows.forEach(async (row) => {
                    const book = new Book(
                        row.id,
                        row.title,
                        row.author_id,
                        row.isbn,
                        row.type,
                        row.stock,
                        row.language,
                        row.pages,
                        row.publisher,
                        new Date(row.datePub).toDateString(),
                        row.description,
                        row.imgUrl,
                        row.price);

                    // fill properties
                    let author = await authorDao.findAuthorById(row.author_id);
                    book.author = author;

                    let publisher = await publisherDao.findPublisherById(row.publisher_id);
                    book.publisher = publisher;

                    books.push(book);
                });

                resolve(books);
            }
        });
    });
}

module.exports = { addBook, updateBook, deleteBook, findBookById, findAllBooks };