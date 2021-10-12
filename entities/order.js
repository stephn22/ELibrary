
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
     * @param {number} customerId id of the customer
     * @param {Date} date date of the order
     * @param {number} price price of the order
     * @param {string} type type of the order (buy, reservation)
     */
    constructor (id, customerId, date, price, type) {
        super(id);
        this.customerId = customerId;
        this.customer = undefined;
        this.date = date;
        this.price = price;
        this.type = type;
        this.items = [{
            book: undefined,
            quantity: undefined
        }];
    }
}

module.exports = Order;