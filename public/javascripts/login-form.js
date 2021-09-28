"use strict";

/************************** CONSTANTS *****************************/

const loginBtn = document.getElementById("login-btn");

const loginEmail = document.getElementById("login-email");
const loginEmailValidation = document.getElementById("login-email-validation");

/************************** EVENT LISTENERS *****************************/

let valid = true;

// check email as input changes
loginEmail.addEventListener("input", () => {
    if (!validateEmail(loginEmail.value)) {
        setValidationMessage(loginEmailValidation, "Please enter a valid email");
        disableBtn(loginBtn);
        valid = false;
    } else {
        clearValidationMsg(loginEmailValidation);
        enableBtn(loginBtn);
        valid = true;
    }
});

loginBtn.addEventListener("click", (e) => {
    if (!valid) {
        e.preventDefault();
    }
});

/************************** VALIDATION METHODS *****************************/

/**
 * Validates email address
 * @link https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
 * @constraint email must be a valid email address
 * @param {string} email email to be checked
 * @returns true if email is valid, false otherwise
 */
 function validateEmail(email) {
    return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email);
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
    btn.setAttribute("disabled", "true");
}