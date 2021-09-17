import baseEntity from './baseEntity.js';

class Author extends baseEntity {
    constructor (id, name) {
        super(id);
        this.name = name;
    }
}