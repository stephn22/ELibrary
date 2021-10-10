const BaseEntity = require("./baseEntity");

/**
 * @class OrderItem represents an order item.
 * @extends BaseEntity extends the base entity for all classes
 */
class OrderItem extends BaseEntity {

    /**
     * Creates an instance of OrderItem.
     * @param {number} id id of the order item
     * @param {number} orderId id of the order
     * @param {number} quantity quantity of the order item
     * @param {number} bookId id of the book
     */
    constructor (id, orderId, quantity, bookId) {
        super(id);
        this.orderId = orderId;
        this.quantity = quantity;
        this.bookId = bookId;
    }
}

module.exports = OrderItem;