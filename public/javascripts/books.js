"use strict";

/************************** CONSTANTS *****************************/

const bookImage = document.getElementById('book-image');
const imgUploaded = document.getElementById('img-uploaded');

const deleteBtns = document.getElementsByClassName('delete-button');

const title = document.getElementById('title');
const titleValidation = document.getElementById('title-validation');

const author = document.getElementById('author');
const authorValidation = document.getElementById('author-validation');

const isbn = document.getElementById('isbn');
const isbnValidation = document.getElementById('isbn-validation');

const publisher = document.getElementById('publisher');
const publisherValidation = document.getElementById('publisher-validation');

const stockRange = document.getElementById('stock-range');
const stockRangeLabel = document.getElementById('stock-range-label');

const pagesRange = document.getElementById('pages-range');
const pagesRangeLabel = document.getElementById('pages-range-label');

const datePublished = document.getElementById('date-published');
const datePublishedValidation = document.getElementById('date-published-validation');

const description = document.getElementById('description');
const descriptionInfo = document.getElementById('description-info');
const descriptionValidation = document.getElementById('description-validation');

const price = document.getElementById('price');
const priceValidation = document.getElementById('price-validation');

const saveBtn = document.getElementById('save');

/************************** EVENT LISTENERS *****************************/

if (bookImage && title && author && isbn && paper && ebook && publisher && stockRange && pagesRange && datePublished && description && price && saveBtn) {
    let valid = true;

    bookImage.addEventListener('change', (input) => {
        if (input.target.files && input.target.files[0]) {
            const reader = new FileReader();

            reader.onload = function (e) {
                imgUploaded.setAttribute("src", e.target.result);
                imgUploaded.removeAttribute("hidden");
            };

            reader.readAsDataURL(input.target.files[0]);
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
        stockRangeLabel.innerHTML = `In stock: ${stockRange.value}`;
    });

    pagesRange.addEventListener('input', () => {
        pagesRangeLabel.innerHTML = `Pages: ${pagesRange.value}`;
    });

    saveBtn.addEventListener('click', (e) => {
        if (!valid) {
            e.preventDefault();
        }
    });
}

// add event listeners to buttons delete
for (let i = 0; i < deleteBtns.length; i++) {
    // get the book id
    deleteBtns[i].addEventListener('click', () => {
        const id = deleteBtns[i].getAttribute('data-id');

        // and delete the book if clicked
        if (id) {
            deleteBook(parseInt(id));
        }
    });
}

/************************** FETCH API METHODS *****************************/

/**
 * Using the fetch API to delete a book by its id
 * @param {number} bookId the book id
 */
function deleteBook(bookId) {
    fetch(`/books/${bookId}`, { method: "DELETE" })
        .then()
        .catch(error => console.error('Error:', error));
}

/************************** VALIDATION METHODS *****************************/

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
 * @param {HTMLElement} element 
 * @param {string} message 
 */
function setValidationMessage(element, message) {
    element.innerHTML = message;
}

/**
 * Clear validation message of the given HTML element
 * @param {HTMLElement} validationElement HTML element to clear validation message
 */
function clearValidationMsg(validationElement) {
    validationElement.innerHTML = "";
}

/**
 * Enables a button
 * @param {HTMLElement} btn button to be enabled
 */
function enableBtn(btn) {
    btn.removeAttribute("disabled");
}

/**
 * Disables a button
 * @param {HTMLElement} btn button to be disabled
 */
function disableBtn(btn) {
    btn.setAttribute("disabled", "disabled");
}