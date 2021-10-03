"use strict";

const Book = require("./book");

/**
 * @class Favourites represents a list of favourite books.
 */
class Favourites {

    /**
     * Instantiate a new favourite items array
     * @param {number} userId id of user
     */
    constructor(userId) {
        this.userId = userId;

        /**
         * @type {Book[]}
         */
        this.items = [];
    }

    /**
     * Add a new FavouriteItem to the favourites list.
     * @param {Book} book list of favourited books
     */
    addItem(book) {
        this.items.push(book);
    }
}

module.exports = Favourites;