
const Book = require('./book');
const CartItem = require('./cartItem');

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
        this.price = this.getTotalPrice();
    }

    /**
     * Adds a book to the cart
     * @param {Book} item book to add
     * @param {number} quantity quantity of the book to add
     */
    add(item, quantity) {
        this.items.forEach(element => {
            if (element.book.id === item.id) {
                element.updateQuantity(element.quantity + quantity);
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

    getTotalPrice() {
        let total = 0;

        this.items.forEach(element => {
            total += (element.price * element.quantity);
        });

        return total;
    }
}

module.exports = Cart;