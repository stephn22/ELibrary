"use strict";

/************************** CONSTANTS *****************************/

const newEmail = document.getElementById("new-email");
const newEmailValidation = document.getElementById("new-email-validation");

const newPassword = document.getElementById("new-password");
const newPasswordValidation = document.getElementById("new-password-validation");

const confirmNewPassword = document.getElementById("confirm-new-password");
const confirmNewPasswordValidation = document.getElementById("confirm-new-password-validation");

const newEmailConfirmBtn = document.getElementById("save-new-email");
const newPasswordConfirmBtn = document.getElementById("save-new-password");

/************************** EVENT LISTENERS *****************************/

let valid = true;

newEmail.addEventListener("input", () => {
    if (!validateEmail(newEmail.value)) {
        setValidationMessage(newEmailValidation, "Please enter a valid email address");
        disableBtn(newEmailConfirmBtn);
        valid = false;
    } else {
        clearValidationMsg(newEmailValidation);
        enableBtn(newEmailConfirmBtn);
        valid = true;
    }
});

newPassword.addEventListener("input", () => {
    if (!validatePassword(newPassword.value)) {
        setValidationMessage(newPasswordValidation, "Password must be at least 8 characters long and contain at least one digit and one special character");
        disableBtn(newPasswordConfirmBtn);
        valid = false;
    } else {
        clearValidationMsg(newPasswordValidation);
        enableBtn(newPasswordConfirmBtn);
        valid = true;
    }
});

confirmNewPassword.addEventListener("input", () => {
    if (!validatePasswordAndConfirm(newPassword.value, confirmNewPassword.value)) {
        setValidationMessage(confirmNewPasswordValidation, "Passwords do not match");
        disableBtn(newPasswordConfirmBtn);
        valid = false;
    } else {
        clearValidationMsg(confirmNewPasswordValidation);
        enableBtn(newPasswordConfirmBtn);
        valid = true;
    }
});

/************************** VALIDATION *****************************/

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