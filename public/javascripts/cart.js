"use strict";

/************************** CONSTANTS *****************************/

const removeBtns = document.querySelectorAll('.remove');
const editBtns = document.querySelectorAll('.edit');
const quantityRanges = document.querySelectorAll('.quantity-range');
const quantityRangesLabels = document.querySelectorAll('.quantity-range-label');


/************************** EVENT LISTENERS *****************************/

for (let i = 0; i < quantityRanges.length; i++) {
    quantityRanges[i].addEventListener('input', () => {
        quantityRangesLabels[i].innerHTML = `Quantity: ${quantityRanges[i].value}`
    });
}

for (let i = 0; i < editBtns.length; i++) {
    editBtns[i].addEventListener('click', () => {
        const bookId = parseInt(editBtns[i].getAttribute('data-id'));

        const quantityRange = document.getElementById(`quantity-range-${bookId}`);

        if (quantityRange != null) {
            editBookInCart(bookId, quantityRange.value);

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
    fetch(`/sessions/cart/${bookId}/${quantity}`, {
        method: 'PUT',
        body: {}
    }).then((_res) => window.location.reload())
        .catch(err => console.log(err));
}

/**
 * Using fetch API tp remove a book from the cart
 * @param {number} bookId id of the book to remove
 */
function removeFromCart(bookId) {
    fetch(`/sessions/cart/${bookId}`, {
        method: 'DELETE',
    }).then((_res) => window.location.reload())
        .catch(err => console.log(err));
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