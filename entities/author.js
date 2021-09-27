const baseEntity = require('./baseEntity');

/**
 * @class Author represents an author of a book.
 * @extends baseEntity extends the base class for all entities
 */
class Author extends baseEntity {

    /**
     * Create a new Author object
     * @param {number} id id of the author
     * @param {string} name name of the author
     */
    constructor(id, name) {
        super(id);
        this.name = name;
    }
}

module.exports = Author;