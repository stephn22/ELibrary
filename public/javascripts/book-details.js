"use strict";

/************************** CONSTANTS *****************************/

/**
 * @type {HTMLImageElement}
 */
const bookImage = document.getElementById('book-image');

/**
 * @type {HTMLFormElement}
 */
const form = document.getElementById('edit-book-form');

/**
 * @type {HTMLButtonElement}
 */
const uploadNewImg = document.getElementById('upload-new-img');

/**
 * @type {HTMLInputElement}
 */
const newImgInput = document.getElementById('new-img-input');

/**
 * @type {HTMLButtonElement}
 */
const addToCartBtn = document.getElementById('add-to-cart-confirm');

/**
 * @type {HTMLButtonElement}
 */
const reserveBook = document.getElementById('reserve-book-confirm');

/**
 * @type {HTMLSelectElement}
 */
const bookQty = document.getElementById('book-quantity');

/**
 * @type {HTMLButtonElement}
 */
const deleteBtn = document.getElementById('delete-book');

/**
 * @type {HTMLInputElement}
 */
const title = document.getElementById('title');

/**
 * @type {HTMLSpanElement}
 */
const titleValidation = document.getElementById('title-validation');

/**
 * @type {HTMLInputElement}
 */
const author = document.getElementById('author');

/**
 * @type {HTMLSpanElement}
 */
const authorValidation = document.getElementById('author-validation');

/**
 * @type {HTMLInputElement}
 */
const isbn = document.getElementById('isbn');

/**
 * @type {HTMLSpanElement}
 */
const isbnValidation = document.getElementById('isbn-validation');

/**
 * @type {HTMLInputElement}
 */
const paper = document.getElementById('paper');

/**
 * @type {HTMLInputElement}
 */
const ebook = document.getElementById('ebook');

/**
 * @type {HTMLInputElement}
 */
const language = document.getElementById('languages-select');

/**
 * @type {HTMLParagraphElement}
 */
const languageInfo = document.getElementById('language-info');

/**
 * @type {HTMLInputElement}
 */
const publisher = document.getElementById('publisher');

/**
 * @type {HTMLSpanElement}
 */
const publisherValidation = document.getElementById('publisher-validation');

/**
 * @type {HTMLInputElement}
 */
const stockRange = document.getElementById('stock-range');

/**
 * @type {HTMLLabelElement}
 */
const stockRangeLabel = document.getElementById('stock-range-label');

/**
 * @type {HTMLInputElement}
 */
const pagesRange = document.getElementById('pages-range');

/**
 * @type {HTMLLabelElement}
 */
const pagesRangeLabel = document.getElementById('pages-range-label');

/**
 * @type {HTMLInputElement}
 */
const datePublished = document.getElementById('date-published');

/**
 * @type {HTMLSpanElement}
 */
const datePublishedValidation = document.getElementById('date-published-validation');

/**
 * @type {HTMLTextAreaElement}
 */
const description = document.getElementById('description');

/**
 * @type {HTMLParagraphElement}
 */
const descriptionInfo = document.getElementById('description-info');

/**
 * @type {HTMLSpanElement}
 */
const descriptionValidation = document.getElementById('description-validation');

/**
 * @type {HTMLInputElement}
 */
const price = document.getElementById('price');

/**
 * @type {HTMLSpanElement}
 */
const priceValidation = document.getElementById('price-validation');

/**
 * @type {HTMLButtonElement}
 */
const saveBtn = document.getElementById('save-btn');

const formData = new FormData();

/************************** EVENT LISTENERS *****************************/

let valid = true;

if (title
    && author
    && isbn
    && paper
    && language
    && publisher
    && stockRange
    && pagesRange
    && datePublished
    && description
    && price) {
    descriptionInfo.innerHTML = `Remaining: ${250 - description.value.length}`;
    disableBtn(saveBtn);

    uploadNewImg.addEventListener('click', () => {
        newImgInput.click();
    });

    newImgInput.addEventListener('change', (input) => {
        if (input.target.files && input.target.files[0]) {
            const reader = new FileReader();

            reader.onload = function (e) {
                bookImage.setAttribute("src", e.target.result);
                bookImage.removeAttribute("hidden");
            };

            reader.readAsDataURL(input.target.files[0]);
            enableBtn(saveBtn);
        }
    });

    title.addEventListener('input', () => {
        if (!validateTitle(title.value)) {
            setValidationMessage(titleValidation, "Please enter a valid title name, must be between 1 and 100 characters");
            disableBtn(saveBtn);
            valid = false;
        } else {
            clearValidationMsg(titleValidation);
            enableBtn(saveBtn);
            valid = true;
        }
    });

    author.addEventListener('input', () => {
        if (!validateName(author.value)) {
            setValidationMessage(authorValidation, "Please enter a valid author name, must be between 1 and 100 characters");
            disableBtn(saveBtn);
            valid = false;
        } else {
            clearValidationMsg(authorValidation);
            enableBtn(saveBtn);
            valid = true;
        }
    });

    isbn.addEventListener('input', () => {
        if (!validateISBN(isbn.value)) {
            setValidationMessage(isbnValidation, "Please enter a valid ISBN");
            disableBtn(saveBtn);
            valid = false;
        } else {
            clearValidationMsg(isbnValidation);
            enableBtn(saveBtn);
            valid = true;
        }
    });

    language.addEventListener('change', () => {
        enableBtn(saveBtn);
    });

    paper.addEventListener('click', () => {
        enableBtn(saveBtn);
    });

    ebook.addEventListener('click', () => {
        enableBtn(saveBtn);
    });

    publisher.addEventListener('input', () => {
        if (!validateName(publisher.value)) {
            setValidationMessage(publisherValidation, "Please enter a valid publisher name, must be between 1 and 100 characters");
            disableBtn(saveBtn);
            valid = false;
        } else {
            clearValidationMsg(publisherValidation);
            enableBtn(saveBtn);
            valid = true;
        }
    });

    datePublished.addEventListener('input', () => {
        if (!validateDate(datePublished.value)) {
            setValidationMessage(datePublishedValidation, "Please enter a valid date, must be in the past");
            disableBtn(saveBtn);
            valid = false;
        } else {
            clearValidationMsg(datePublishedValidation);
            enableBtn(saveBtn);
            valid = true;
        }
    });

    description.addEventListener('input', () => {

        descriptionInfo.innerHTML = `Remaining: ${250 - description.value.length}`;

        if (!validateDescription(description.value)) {
            setValidationMessage(descriptionValidation, "Please enter a valid description, must be between 1 and 250 characters");
            disableBtn(saveBtn);
            valid = false;
        } else {
            clearValidationMsg(descriptionValidation);
            enableBtn(saveBtn);
            valid = true;
        }
    });

    price.addEventListener('input', () => {
        if (!validatePrice(price.value)) {
            setValidationMessage(priceValidation, "Please enter a valid price, must be between 0.01 and 100.00");
            disableBtn(saveBtn);
            valid = false;
        } else {
            clearValidationMsg(priceValidation);
            enableBtn(saveBtn);
            valid = true;
        }
    });

    stockRange.addEventListener('input', () => {
        enableBtn(saveBtn);
        stockRangeLabel.innerHTML = `In stock: ${stockRange.value}`;
    });

    pagesRange.addEventListener('input', () => {
        enableBtn(saveBtn);
        pagesRangeLabel.innerHTML = `Pages: ${pagesRange.value}`;
    });

    saveBtn.addEventListener('click', (e) => {
        if (!valid) {
            e.preventDefault();
        } else {
            // get book id
            const bookId = parseInt(form.getAttribute('data-id'));

            // prepare the form data
            formData.append('title', title.value);
            formData.append('author', author.value);
            formData.append('isbn', isbn.value);
            formData.append('publisher', publisher.value);
            formData.append('stock', stockRange.value);
            formData.append('language', language.value === '--' ? languageInfo.getAttribute('data-language') : language.value);
            formData.append('pages', pagesRange.value);
            formData.append('price', price.value);
            formData.append('type', paper.checked ? 'Paper' : 'Ebook');
            formData.append('date-published', datePublished.value);
            formData.append('description', description.value);
            formData.append('new-img', newImgInput.files[0]);

            // send the form data
            updateBook(bookId, formData);
        }
    });
}

if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
        const bookId = parseInt(addToCartBtn.getAttribute('data-id'));
        const quantity = parseInt(bookQty.value);

        if (bookId && quantity) {
            addToCart(bookId, quantity);
        }
    });
}

if (reserveBook) {
    reserveBook.addEventListener('click', () => {
        const bookId = parseInt(reserveBook.getAttribute('data-id'));
        const userId = parseInt(reserveBook.getAttribute('data-user'));

        if (bookId && userId) {
            createOrder(bookId, userId, "Reservation");
        }
    });
}

if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
        const bookId = parseInt(deleteBtn.getAttribute('data-id'));

        if (bookId) {
            deleteBook(bookId);
        }
    });
}

/************************** FETCH API *****************************/

/**
 * Using fetch API to add the book(s) to cart
 * @param {number} bookId id of the book
 * @param {number} quantity quantity chosen by the user
 */
function addToCart(bookId, quantity) {
    fetch(`/sessions/cart/${bookId}/${quantity}`, {
        method: 'POST',
        body: {},
    }).then(window.location.reload())
        .catch(err => console.log(err));
}

/**
 * Using the fetch API to create a new order
 * @param {number} bookId id of the book
 * @param {number} userId id of the user
 * @param {string} type type of the order
 * @param {number} price price of the book (only if buying)
 * @param {string} address address of the user (only if buying)
 */
function createOrder(bookId, userId, type, price = 0.00, address = "") {
    const body = {
        bookId: bookId,
        userId: userId,
        price: price,
        type: type,
        address: address
    };

    fetch("/orders/reserve", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(window.location.reload())
        .catch(err => console.log(err));
}

/**
 * Using fetch API to update the book
 * @param {number} bookId id of the book to be updated
 * @param {FormData} formData form data to be sent to the server
 */
function updateBook(bookId, formData) {
    fetch(`/book-details/${bookId}`, {
        method: 'PUT',
        body: formData
    }).then(window.location.reload())
        .catch(error => console.error(error));
}

/**
 * Using the fetch API to delete a book by its id
 * @param {number} bookId the book id
 */
function deleteBook(bookId) {
    fetch(`/books/${bookId}`, { method: "DELETE" })
        .then((_res) => {
            window.location.href = "/books";
        })
        .catch(error => console.error('Error:', error));
}

/************************** VALIDATION *****************************/

/**
 * Checks if the book title is valid
 * @param {string} title title of the book
 * @returns true if title is valid, false otherwise
 */
function validateTitle(title) {
    return title.length > 0 && title.length <= 100;
}

/**
 * Checks name of author or publisher is valid
 * @param {string} name name to be validated
 * @returns true if name is valid, false otherwise
 */
function validateName(name) {
    return /^[a-zA-Z ]{1,100}$/.test(name);
}

/**
 * Checks if isbn is valid
 * @param {string} isbn isbn of the book
 * @returns true if isbn is valid, false otherwise
 */
function validateISBN(isbn) {
    return /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(isbn);
}

/**
 * Checks if date is valid
 * @param {string} date date of book publication
 * @returns true if date is valid, false otherwise
 */
function validateDate(date) {
    return /^\d{4}-\d{2}-\d{2}$/.test(date) && Date.now() > new Date(date).getTime();
}

/**
 * Checks if description is valid
 * @param {string} description description of the book
 * @returns true if description is valid, false otherwise
 */
function validateDescription(description) {
    return description.length > 0 && description.length <= 250;
}

/**
 * Checks if price is valid
 * @param {number} price price of the book
 * @returns true if price is valid, false otherwise
 */
function validatePrice(price) {
    return /^\d{0,8}(\.\d{1,4})?$/.test(price);
}

/**
 * Sets the validation message for the given element
 * @param {HTMLSpanElement} element 
 * @param {string} message 
 */
function setValidationMessage(element, message) {
    element.innerHTML = message;
}

/**
 * Clear validation message of the given HTML element
 * @param {HTMLSpanElement} validationElement HTML element to clear validation message
 */
function clearValidationMsg(validationElement) {
    validationElement.innerHTML = "";
}

/**
 * Enables a button
 * @param {HTMLButtonElement} btn button to be enabled
 */
function enableBtn(btn) {
    btn.removeAttribute("disabled");
}

/**
 * Disables a button
 * @param {HTMLButtonElement} btn button to be disabled
 */
function disableBtn(btn) {
    btn.setAttribute("disabled", "disabled");
}