const baseEntity = require('./baseEntity.js');

class User extends baseEntity {
    constructor (id, firstname, lastname, email, password, address, type) {
        super(id);
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.address = address;
        this.type = type;
    }
}

module.exports = User;