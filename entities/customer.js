const baseEntity = require('./baseEntity.js');

class Customer extends baseEntity {
    constructor (id, firstname, lastname, email, password, address) {
        super(id);
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.address = address;
    }
}

module.exports = Customer;