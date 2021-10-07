
const Book = require('./book');
const CartItem = require('./cartItem');
const logger = require('../util/logger');

/**
 * @class Cart represents a shopping cart
 */
class Cart {

    /**
     * Creates a new cart
     * @param {Book} book book to add to the cart
     * @param {number} quantity quantity of the book to add
     * @param {number} total 
     */
    constructor(book, quantity) {
        this.items = [{
            book: book,
            quantity: quantity
        }];
        this.total = quantity;
        this.price = quantity * book.price;
    }
}

module.exports = Cart;