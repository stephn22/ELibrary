import baseEntity from './baseEntity.js';

/**
 * @class Order represents an order entity
 * @extends baseEntity extends the base class for all entities
 */
class Order extends baseEntity {

    /**
     * Constructor for Order
     * @param {number} id id of the order
     * @param {number} customer_id id of the customer
     * @param {Date} date date of the order
     * @param {number} book_id id of the book
     * @param {number} price price of the order
     * @param {number} address_id id of the address
     * @param {string} status status of the order
     */
    constructor (id, customer_id, date, book_id, price, address_id, status) {
        super(id);
        this.customer_id = customer_id;
        this.date = date;
        this.book_id = book_id;
        this.price = price;
        this.address_id = address_id;
        this.status = status;
    }
}

export default Order;