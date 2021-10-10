"use strict";

/************************** CONSTANTS *****************************/

/**
 * @type {HTMLButtonElement}
 */
const signupBtn = document.getElementById("signup-btn");

/**
 * @type {HTMLInputElement}
 */
const fname = document.getElementById("fname");

/**
 * @type {HTMLSpanElement}
 */
const fnameValidation = document.getElementById("fname-validation");

/**
 * @type {HTMLInputElement}
 */
const lname = document.getElementById("lname");

/**
 * @type {HTMLSpanElement}
 */
const lnameValidation = document.getElementById("lname-validation");

/**
 * @type {HTMLInputElement}
 */
const signupEmail = document.getElementById("signup-email");

/**
 * @type {HTMLSpanElement}
 */
const signupEmailValidation = document.getElementById("signup-email-validation");

/**
 * @type {HTMLInputElement}
 */
const signupPwd = document.getElementById("signup-password");

/**
 * @type {HTMLSpanElement}
 */
const signupPwdValidation = document.getElementById("signup-password-validation");

/**
 * @type {HTMLInputElement}
 */
const confirmPwd = document.getElementById("confirm-password");

/**
 * @type {HTMLSpanElement}
 */
const confirmPwdValidation = document.getElementById("confirm-password-validation");

/************************** EVENT LISTENERS *****************************/

let isValid = true;

// Check first name as input changes
fname.addEventListener("input", () => {
    if (!validatePersonName(fname.value)) {
        setValidationMessage(fnameValidation, "Please enter a valid first name");
        disableBtn(signupBtn);
        valid = false;
    } else {
        clearValidationMsg(fnameValidation);
        enableBtn(signupBtn);
        valid = true;
    }
});

// Check last name as input changes
lname.addEventListener("input", () => {
    if (!validatePersonName(lname.value)) {
        setValidationMessage(lnameValidation, "Please enter a valid last name");
        disableBtn(signupBtn);
        valid = false;
    } else {
        clearValidationMsg(lnameValidation);
        enableBtn(signupBtn);
        valid = true;
    }
});

// Check email as input changes
signupEmail.addEventListener("input", () => {
    if (!validateEmail(signupEmail.value)) {
        setValidationMessage(signupEmailValidation, "Please enter a valid email address");
        disableBtn(signupBtn);
        valid = false;

    } else {
        clearValidationMsg(signupEmailValidation);
        enableBtn(signupBtn);
        valid = true;
    }
});

// Check password as input changes
signupPwd.addEventListener("input", () => {
    if (!validatePassword(signupPwd.value)) {
        setValidationMessage(signupPwdValidation, "Password must be at least 8 characters long, must contain at least one digit and one special character");
        disableBtn(signupBtn);
        valid = false;
    } else {
        clearValidationMsg(signupPwdValidation);
        enableBtn(signupBtn);
        valid = true;
    }
});

// Check confirm pwd as input changes
confirmPwd.addEventListener("input", () => {
    if (!validatePasswordAndConfirm(signupPwd.value, confirmPwd.value)) {
        setValidationMessage(confirmPwdValidation, "Password and confirm password must be the same.");
        disableBtn(signupBtn);
        valid = false;

    } else {
        clearValidationMsg(confirmPwdValidation);
        enableBtn(signupBtn);
        valid = true;
    }
});

signupBtn.addEventListener("click", (e) => {
    if (!valid) {
        e.preventDefault();
    }
});

/************************** VALIDATION *****************************/

/**
 * Validates a person name
 * @param {string} text the text to be checked
 * @constraint name must not contain numbers
 * @constraint name must not contain special characters
 * @constraint name must be at least 1 character long
 * @constraint name must not be longer than 50 characters
 * @returns true if text is a valid person name, false otherwise
 */
function validatePersonName(text) {
    return /^[a-zA-Z ]{1,50}$/.test(text);
}

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
 * Checks if password and confirm password are the same
 * @param {string} password password to be checked
 * @param {string} confirmPwd confirm password to be checked
 * @returns true if password and confirm password are the same, false otherwise
 */
function validatePasswordAndConfirm(password, confirmPwd) {
    return password === confirmPwd;
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
