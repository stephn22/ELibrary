/**
 * @class CartItem represents a single item in a cart
 */
 class CartItem {

    /**
     * Creates a new cart item
     * @param {Book} book book in the cart item
     * @param {number} quantity quantity of the book in the cart item
     */
    constructor(book, quantity = 1) {
        this.book = book;
        this.quantity = quantity;

        /**
         * @type {number}
         */
        this.price = book.price * quantity;
    }

    /**
     * Updates the quantity of the cart item
     * @param {number} quantity new quantity
     */
    updateQuantity(quantity) {
        this.quantity = quantity;
        this.price = this.book.price * quantity;
    }
}

module.exports = CartItem;