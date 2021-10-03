
const Book = require('./book');

/**
 * @class Cart represents a shopping cart
 */
class Cart {

    /**
     * Creates a new cart
     * @param {CartItem[]} items 
     * @param {number} total 
     */
    constructor(items = []) {
        this.items = items;
        this.total = items.length;
        this.price = this.price;
    }

    /**
     * Adds a book to the cart
     * @param {Book} item book to add
     * @param {number} quantity quantity of the book to add
     */
    add(item, quantity) {
        this.items.forEach(element => {
            if (element.book.id === item.id) {
                element.updateQuantity(element.quantity + 1);
            } else {
                this.items.push(new CartItem(item, quantity));
            }
        });
    }

    /**
     * Remove an item from the cart
     * @param {Book} item item to remove
     * @param {number} quantity quantity of the item to remove, if 0 remove all items
     */
    remove(item, quantity = 0) {
        if (quantity === 0) {
            const i = this.items.indexOf(item);

            if (i > -1) {
                this.items.splice(i, 1);
            }
        } else {
            this.items.forEach(element => {
                if (element.book.id === item.id) {
                    element.updateQuantity(element.quantity - 1);
                }
            });
        }
    }

    get price() {
        let price = 0.00;

        this.items.forEach(element => {
            price += element.book.price * element.quantity;
        });

        return price;
    }

    set price(value) {
        this.total = value;
    }
}

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

module.exports = Cart, CartItem;