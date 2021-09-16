const baseEntity = require('./baseEntity.js');

class Order extends baseEntity {
    constructor (id, client, date, book, price, address, status) {
        super(id);
        this.client = client;
        this.date = date;
        this.book = book;
        this.price = price;
        this.address = address;
        this.status = status;
    }
}