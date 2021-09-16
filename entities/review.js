const baseEntity = require('./baseEntity.js');

class Review extends baseEntity {
    constructor (id, customer, book, text, rating) {
        super(id);
        this.customer = customer;
        this.book = book;
        this.text = text;
        this.rating = rating;
    }
}