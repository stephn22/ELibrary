"use strict";

/************************** CONSTANTS *****************************/

/**
 * @type {HTMLInputElement}
 */
const creditCart = document.getElementById("credit-card");

/**
 * @type {HTMLInputElement}
 */
const debitCard = document.getElementById("debit-card");

/**
 * @type {HTMLInputElement}
 */
const fullName = document.getElementById("full-name");

/**
 * @type {HTMLSpanElement}
 */
const fullNameValidation = document.getElementById("full-name-validation");

/**
 * @type {HTMLInputElement}
 */
const cardNumber = document.getElementById("card");

/**
 * @type {HTMLSpanElement}
 */
const cardNumberValidation = document.getElementById("card-validation");

/**
 * @type {HTMLInputElement}
 */
const expirationDate = document.getElementById("expiration");

/**
 * @type {HTMLSpanElement}
 */
const expirationDateValidation = document.getElementById("expiration-validation");

/**
 * @type {HTMLInputElement}
 */
const cvv = document.getElementById("cvv");

/**
 * @type {HTMLSpanElement}
 */
const cvvValidation = document.getElementById("cvv-validation");

/**
 * @type {HTMLButtonElement}
 */
const payBtn = document.getElementById("pay-btn");

/************************** EVENT LISTENERS *****************************/

let valid = true;

fullName.addEventListener("input", () => {
    if (!validatePersonName(fullName.value)) {
        setValidationMessage(fullNameValidation, "Please enter a valid name");
        disableBtn(payBtn);
        valid = false;
    } else {
        clearValidationMsg(fullNameValidation);
        enableBtn(payBtn);
        valid = true;
    }
});

cardNumber.addEventListener("input", () => {
    if (!validateCardNumber(cardNumber.value)) {
        setValidationMessage(cardNumberValidation, "Please enter a valid credit card number");
        disableBtn(payBtn);
        valid = false;
    } else {
        clearValidationMsg(cardNumberValidation);
        enableBtn(payBtn);
        valid = true;
    }
});

expirationDate.addEventListener("input", () => {
    if (!validateExpirationDate(expirationDate.value)) {
        setValidationMessage(expirationDateValidation, "Please enter a valid expiration date");
        disableBtn(payBtn);
        valid = false;
    } else {
        clearValidationMsg(expirationDateValidation);
        enableBtn(payBtn);
        valid = true;
    }
});

cvv.addEventListener("input", () => {
    if (!validateCVV(cvv.value)) {
        setValidationMessage(cvvValidation, "Please enter a valid CVV");
        disableBtn(payBtn);
        valid = false;
    } else {
        clearValidationMsg(cvvValidation);
        enableBtn(payBtn);
        valid = true;
    }
});

payBtn.addEventListener("submit", (e) => {
    if (!valid) {
        e.preventDefault();
    }
});

/************************** VALIDATION *****************************/

/**
 * Validates a person name
 * @param {string} text the text to be checked
 * @returns true if text is a valid person name, false otherwise
 */
function validatePersonName(text) {
    return /^[a-zA-Z ]{1,50}$/.test(text);
}

/**
 * Validates a card number
 * @param {string} cardNumber text to be checked
 * @returns true if text is a valid card number, false otherwise
 */
function validateCardNumber(cardNumber) {
    return /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$/.test(cardNumber);
}

/**
 * Validates a card expiration date
 * @param {string} date date to be checked
 * @returns true if date is a valid card expiration date, false otherwise
 */
function validateExpirationDate(date) {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const exDate = new Date(date);
    const exMonth = exDate.getMonth() + 1;
    const exYear = exDate.getFullYear();

    return /^\d{4}-\d{2}$/.test(date) && (exYear > year || (exYear === year && exMonth >= month));
}

/**
 * Validates a cvv number
 * @param {string} cvv 
 * @returns true if cvv is a valid cvv, false otherwise
 */
function validateCVV(cvv) {
    return /^[0-9]{3,4}$/.test(cvv);
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
    btn.setAttribute("disabled", "true");
}
