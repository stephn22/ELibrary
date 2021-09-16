const baseEntity = require('./baseEntity.js');

class Address extends baseEntity {
    constructor (id, customer, placename) {
        super(id);
        this.customer = customer;
        this.placename = placename;
    }
}