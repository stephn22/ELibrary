const baseEntity = require('./baseEntity');

/**
 * @class Review represent a review of a book.
 * @extends baseEntity extends the base class for all entities.
 */
class Review extends baseEntity {
    
    /**
     * Constructor for Review object
     * @param {number} id id of the review
     * @param {number} customer_id id of the customer that made the review
     * @param {Date} date date of the review
     * @param {number} book_id id of the book that was reviewed
     * @param {string} text text of the review 
     * @param {number} rating rating (1-10) of the review
     */
    constructor (id, customer_id, date, book_id, text, rating) {
        super(id);
        this.customer_id = customer_id;
        this.customer = undefined;
        this.date = date;
        this.book_id = book_id;
        this.book = undefined;
        this.text = text;
        this.rating = rating;
    }
}

module.exports = Review;