"use strict";

/************************** CONSTANTS *****************************/

/**
 * @type {HTMLHeadingElement}
 */
const cartTitle = document.getElementById('title');

/**
 * @type {NodeListOf<HTMLButtonElement>}
 */
const removeBtns = document.querySelectorAll('.remove');

/**
 * @type {NodeListOf<HTMLButtonElement>}
 */
const editBtns = document.querySelectorAll('.edit');

/**
 * @type {NodeListOf<HTMLInputElement>}
 */
const quantityRanges = document.querySelectorAll('.quantity-range');

/**
 * @type {NodeListOf<HTMLLabelElement>}
 */
const quantityRangesLabels = document.querySelectorAll('.quantity-range-label');


/************************** EVENT LISTENERS *****************************/

for (let i = 0; i < quantityRanges.length; i++) {
    quantityRanges[i].addEventListener('input', () => {
        quantityRangesLabels[i].innerHTML = `Quantity: ${quantityRanges[i].value}`;
    });
}

for (let i = 0; i < editBtns.length; i++) {
    editBtns[i].addEventListener('click', () => {
        const bookId = parseInt(editBtns[i].getAttribute('data-id'));

        /**
         * @type {HTMLInputElement}
         */
        const quantityRange = document.getElementById(`quantity-range-${bookId}`);

        if (quantityRange != null) {
            editBookInCart(bookId, parseInt(quantityRange.value));

            const quantity = parseInt(quantityRange.value);

            if (bookId && quantity) {
                editBookInCart(bookId, quantity);
            }
        }
    });
}

for (let i = 0; i < removeBtns.length; i++) {
    removeBtns[i].addEventListener('click', () => {
        const bookId = removeBtns[i].getAttribute('data-id');

        if (bookId) {
            removeFromCart(parseInt(bookId));
        }
    });
}

/************************** FETCH API METHODS *****************************/

/**
 * Using fetch API to edit a book in the cart
 * @param {number} bookId id of the book to edit
 * @param {number} quantity new quantity of the book
 */
function editBookInCart(bookId, quantity) {
    fetch(`/sessions/cart`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            bookId: bookId,
            quantity: quantity,
        })
    }).then(res => {
        if (res.status === 200) {
            window.location.href = res.url;
        }
    }).catch(err => console.log(err));
}

/**
 * Using fetch API tp remove a book from the cart
 * @param {number} bookId id of the book to remove
 */
function removeFromCart(bookId) {
    fetch(`/sessions/cart/${bookId}`, {
        method: 'DELETE',
    }).then(res => {
        if (res.status === 200) {
            const book = document.getElementById(`book-${bookId}`);
            fadeOut(book);
            const cartPrice = cartTitle.getAttribute('data-price');
            const bookPrice = book.getAttribute('data-price');
            const quantity = book.getAttribute('data-quantity');

            cartTitle.innerHTML = `Cart: ${cartPrice - (bookPrice * quantity)} €`;
        }
    }).catch(err => console.log(err));
}

/************************** ANIMATIONS *****************************/

/**
 * Animates an element with fade in transition (0.3s)
 * @param {Element} element element to be animated
 */
function fadeIn(element) {
    element.removeAttribute("hidden");

    setTimeout(() => {
        element.classList.remove("fade-effect");
    }, 280);
}

/**
 * Animates an element with fade out transition (0.3s)
 * @param {Element} element element to be animated
 */
function fadeOut(element) {
    element.classList.add("fade-effect");
    setTimeout(() => {
        element.setAttribute("hidden", "");
    }, 350);
}