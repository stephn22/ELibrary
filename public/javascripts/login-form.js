"use strict";

/************************** CONSTANTS *****************************/

const loginBtn = document.getElementById("login-btn");

const loginEmail = document.getElementById("login-email");
const loginEmailValidation = document.getElementById("login-email-validation");

const loginPassword = document.getElementById("login-password");
const loginPasswordValidation = document.getElementById("login-password-validation");

const remember = document.getElementById("remember-me");

/************************** EVENT LISTENERS *****************************/

const valid = true;

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

// check password as input changes
loginPassword.addEventListener("input", () => {
    if (!validatePassword(loginPassword.value)) {
        setValidationMessage(loginPasswordValidation, "Please enter a valid password");
        disableBtn(loginBtn);
        valid = false;
    } else {
        clearValidationMsg(loginPasswordValidation);
        enableBtn(loginBtn);
        valid = true;
    }
});

loginBtn.addEventListener("submit", (e) => {
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
 * Checks if password is valid
 * @constraint password must be at least 8 characters long
 * @constraint password must contain at least one digit
 * @constraint password must contain at least one special character
 * @param {string} password password to be checked
 * @returns true if password is valid, false otherwise
 */
function validatePassword(password) {
    return /^.*(?=.{8,})(?=.*[\d])(?=.*[\W]).*$/.test(password);
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