"use strict";

const db = require('../db.js');

const Book = require('../entities/book');

/**
 * Add book to database.
 * @param {Book} book book to add to database
 * @returns {Promise.<number>} id of book.
 */
function addBook(book) {
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO books (title, author_id, isbn, publisher, datePub, description, imgUrl, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        db.run(query, [
            book.title, 
            book.author_id, 
            book.isbn, 
            book.publisher, 
            book.datePub, 
            book.description, 
            book.imgUrl, 
            book.price], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.lastID);
                }
            });
    });
}

/**
 * Update a book in database.
 * @param {Book} book book to be updated
 * @returns {Promise.<number>} id of updated book.
 */
function updateBook(book) {
    return new Promise((resolve, reject) => {
        const query = "UPDATE books SET title = ?, author = ?, isbn = ?, publisher = ?, datePub = ?, description = ?, imgUrl = ?, price = ? WHERE id = ?";

        db.run(query, [
            book.title,
            book.author,
            book.isbn,
            book.publisher,
            book.datePub,
            book.description,
            book.imgUrl,
            book.price,
        ], (err) => {
            if (err) {
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
 * @returns {Promise.<number>} id of deleted book.
 */
function deleteBook(id) {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM books WHERE id = ?";

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
 * Find book by id.
 * @param {number} id id of book.
 * @returns {Promise.<Book>} book.
 */
function findBookById(id) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM books WHERE id = ?";

        db.get(query, [id], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve({ error: "No such book" });
            } else {
                const book = new Book(
                    row.id, 
                    row.title, 
                    row.author_id, 
                    row.isbn, 
                    row.publisher, 
                    row.datePub, 
                    row.description, 
                    row.imgUrl, 
                    row.price);

                resolve(book);
            }
        });
    });
}

/**
 * Return all books in database as array.
 * @returns {Promise.<Book[]>} array of books.
 */
function findAllBooks() {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM books";

        db.all(query, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            const books = rows.map(row => (new Book(
                row.id,
                row.title,
                row.author_id,
                row.isbn,
                row.publisher,
                row.datePub,
                row.description,
                row.imgUrl,
                row.price)));

            resolve(books);
        });
    });
}

module.exports = { addBook, updateBook, deleteBook, findBookById, findAllBooks };