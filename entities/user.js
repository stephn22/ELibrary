const BaseEntity = require('./baseEntity');

/**
 * @class User represents an user entity
 * @extends BaseEntity extends the base class for all entities
 */
class User extends BaseEntity {

    /**
     * Create a new user
     * @param {number} id id of the user
     * @param {string} firstname firstname of the user
     * @param {string} lastname lastname of the user
     * @param {string} email email of the user
     * @param {string} password password of the user
     * @param {string} type type of the user (admin or customer)
     */
    constructor (id, firstname, lastname, email, password, type) {
        super(id);
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.type = type;
    }
}

module.exports = User;