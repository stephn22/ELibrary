const baseEntity = require('./baseEntity.js');

class Order extends baseEntity {
    constructor (id, customer, date, book, price, address, status) {
        super(id);
        this.customer = customer;
        this.date = date;
        this.book = book;
        this.price = price;
        this.address = address;
        this.status = status;
    }
}