const BaseEntity = require('./baseEntity');
const Book = require('./book');

/**
 * @class Features represent the features that are displayed in the index page.
 * @extends BaseEntity extends the base entity for all classes.
 */
class Features extends BaseEntity {

    /**
     * Creates a new Features entity.
     * @param {number} id id of the feature.
     * @param {number} bookId id of the book.
     */
    constructor(id, bookId) {
        super(id);
        this.bookId = bookId;

        /**
         * @type {Book}
         */
        this.book = undefined;
    }
}

module.exports = Features;