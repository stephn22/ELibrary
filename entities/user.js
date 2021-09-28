const baseEntity = require('./baseEntity');

/**
 * @class User represents an user entity
 * @extends baseEntity extends the base class for all entities
 */
class User extends baseEntity {

    /**
     * Create a new user
     * @param {number} id id of the user
     * @param {string} firstname firstname of the user
     * @param {string} lastname lastname of the user
     * @param {string} email email of the user
     * @param {string} password password of the user
     * @param {number} address address of the user
     * @param {string} type type of the user (admin or customer)
     */
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