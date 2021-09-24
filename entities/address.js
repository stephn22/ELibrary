const baseEntity = require('./baseEntity');

/**
 * @class Address represents an address entity.
 * @extends baseEntity extends the base class for all entities
 */
class Address extends baseEntity {

    /**
     * @param {number} id if of the address
     * @param {number} customer_id id of the customer
     * @param {string} placename information about the address (street, city, state, zipcode, etc.)
     */
    constructor (id, customer_id, placename) {
        super(id);
        this.customer_id = customer_id;
        this.customer = undefined;
        this.placename = placename;
    }
}

module.exports = Address;