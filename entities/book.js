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
     * @param {Author} author entity of the author that wrote the book
     * @param {string} isbn isbn of the book
     * @param {string} type type of the book (paper, ebook)
     * @param {number} stock stock of the book
     * @param {string} language language of the book
     * @param {number} pages pages of the book
     * @param {number} publisher_id id of the publisher of the book
     * @param {Publisher} publisher entity of the publisher of the book
     * @param {Date} datePub publication date of the book
     * @param {string} description brief description of the book
     * @param {Blob} imgUrl represent image of the book
     * @param {number} price price of the book
     */
    constructor (id, title, author_id, isbn, type, stock, language, pages, publisher_id, datePub, description, imgUrl, price) {
        super(id);
        this.title = title;
        this.author_id = author_id;
        this.author = undefined;
        this.isbn = isbn;
        this.type = type;
        this.stock = stock;
        this.language = language;
        this.pages = pages;
        this.publisher_id = publisher_id;
        this.publisher = undefined;
        this.datePub = datePub;
        this.description = description;
        this.imgUrl = imgUrl;
        this.price = price;
    }
}

module.exports = Book;