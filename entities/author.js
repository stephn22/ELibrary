const baseEntity = require('./baseEntity');

class Author extends baseEntity {
    constructor (id, name) {
        super(id);
        this.name = name;
    }
}

module.exports = Author;