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
     * @param {Author} author entity of the author that wrote the book
     * @param {string} isbn isbn of the book
     * @param {string} type type of the book (paper, ebook)
     * @param {number} stock stock of the book
     * @param {string} language language of the book
     * @param {number} pages pages of the book
     * @param {Publisher} publisher entity of the publisher of the book
     * @param {Date} datePub publication date of the book
     * @param {string} description brief description of the book
     * @param {Blob} imgUrl represent image of the book
     * @param {number} price price of the book
     * @param {boolean} isReserved is the book reserved
     */
    constructor (id, title, author, isbn, type, stock, language, pages, publisher, datePub, description, imgUrl, price, isReserved = false) {
        super(id);
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.type = type;
        this.stock = stock;
        this.language = language;
        this.pages = pages;
        this.publisher = publisher;
        this.datePub = datePub;
        this.description = description;
        this.imgUrl = imgUrl;
        this.price = price;
        this.isReserved = isReserved;
    }
}

module.exports = Book;