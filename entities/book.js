const baseEntity = require('./baseEntity.js');

class Book extends baseEntity {
    constructor (id, title, author, isbn, publisher, datePub, description, imgUrl, price) {
        super(id);
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.publisher = publisher;
        this.datePub = datePub;
        this.description = description;
        this.imgUrl = imgUrl;
        this.price = price;
    }
}

module.exports = Book;