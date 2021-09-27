const Address = require('./address');
const baseEntity = require('./baseEntity');
const Book = require('./book');
const User = require('./user');

/**
 * @class Order represents an order entity
 * @extends baseEntity extends the base class for all entities
 */
class Order extends baseEntity {

    /**
     * Constructor for Order
     * @param {number} id id of the order
     * @param {number} customer_id id of the customer
     * @param {User} customer customer entity
     * @param {Date} date date of the order
     * @param {number} book_id id of the book
     * @param {Book} book book entity
     * @param {number} price price of the order
     * @param {number} address_id id of the address
     * @param {Address} address address entity
     * @param {string} status status of the order
     * @param {string} type type of the order (buy, reservation)
     */
    constructor (id, customer_id, date, book_id, price, address_id, status, type) {
        super(id);
        this.customer_id = customer_id;
        this.customer = undefined;
        this.date = date;
        this.book_id = book_id;
        this.book = undefined;
        this.price = price;
        this.address_id = address_id;
        this.address = undefined;
        this.status = status;
        this.type = type;
    }
}

module.exports = Order;