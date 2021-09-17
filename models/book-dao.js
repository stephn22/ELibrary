"use strict";

const db = require('../db.js');

import Book from "../entities/book.js";

/**
 * Add book to database.
 * @param {Book} book to add to database
 * @returns {Promise.<number>} id of book.
 */
 export function addBook(book) {
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO books (title, author, isbn, publisher, datePub, description, imgUrl, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        db.run(query, [
            book.title, 
            book.author, 
            book.isbn, 
            book.publisher, 
            book.datePub, 
            book.description, 
            book.imgUrl, 
            book.price], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.id);
                }
            });
    });
}

/**
 * Update a book in database.
 * @param {Book} book to be updated
 * @returns {Promise.<number>} id of updated book.
 */
export function updateBook(book) {
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
                resolve(this.id);
            }
        });
    });
}

/**
 * Delete a book from database.
 * @param {number} id of book.
 * @returns {Promise.<number>} id of deleted book.
 */
export function deleteBook(id) {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM books WHERE id = ?";

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
 * Find book by id.
 * @param {number} id of book.
 * @returns {Promise.<Book>} book.
 */
export function getBookById(id) {
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
                    row.author, 
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
export function getAllBooks() {
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
                row.author,
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