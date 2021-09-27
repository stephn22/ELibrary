const baseEntity = require('./baseEntity');

/**
 * @class Publisher represents a publisher of a book.
 * @extends baseEntity extends the base class for all entities.
 */
class Publisher extends baseEntity {
    
    /**
     * Create a new Publisher object.
     * @param {number} id 
     * @param {string} name 
     */
    constructor(id, name) {
        super(id);
        this.name = name;
    }
}

module.exports = Publisher;