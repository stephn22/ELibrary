const baseEntity = require('./baseEntity');

/**
 * @class Book represents a book entity.
 * @extends baseEntity extends the base class for all entities
 */
class Book extends baseEntity {

    /**
     * Create a new Book object.
     * @param {number} id id of the book
     * @param {string} title title of the book
     * @param {number} author_id id of the author that wrote the book
     * @param {string} isbn isbn of the book
     * @param {string} publisher entity that published the book
     * @param {Date} datePub publication date of the book
     * @param {string} description brief description of the book
     * @param {Blob} imgUrl represent image of the book
     * @param {number} price price of the book
     */
    constructor (id, title, author_id, isbn, publisher, datePub, description, imgUrl, price) {
        super(id);
        this.title = title;
        this.author_id = author_id;
        this.isbn = isbn;
        this.publisher = publisher;
        this.datePub = datePub;
        this.description = description;
        this.imgUrl = imgUrl;
        this.price = price;
    }
}

module.exports = Book;