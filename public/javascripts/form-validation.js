"use strict";

/**
 * Validation methods for register view and login view
 */

const loginPanel = document.getElementById("login-panel");
const signupPanel = document.getElementById("signup-panel");

const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");

const signupEmail = document.getElementById("signup-email");
const signupEmailValidation = document.getElementById("signup-email-validation");

const signupPwd = document.getElementById("signup-password");
const signupPwdValidation = document.getElementById("signup-password-validation");
const confirmPwd = document.getElementById("confirm-password");
const confirmPwdValidation = document.getElementById("confirm-password-validation");

const remember = document.getElementById("remember-me");

// signup page
if (signupEmail !== null && signupPwd !== null && confirmPwd !== null) {
    // Check email as input change
    signupEmail.addEventListener("input", () => {
        if (!validateEmail(signupEmail.value)) {
            signupEmailValidation.innerHTML = "This is an invalid email address";
            signupBtn.disabled = true;
        } else {
            clearValidationMsg(signupEmailValidation);
            signupBtn.disabled = false;
        }
    });

    // Check confirm pwd as input change
    confirmPwd.addEventListener("input", () => {
        if (!validatePasswordAndConfirm(signupPwd.value, confirmPwd.value)) {
            confirmPwdValidation.innerHTML = "Password and confirm password must be the same.";
            signupBtn.disabled = true;
        } else {
            clearValidationMsg(confirmPwdValidation);
            signupBtn.disabled = false;
        }
    });


    // Signup
    signupBtn.addEventListener("click", (e) => {

        const valid = true;

        // Update panels
        openPanel(signupPanel, loginPanel);

        // Validate signup form
        if (!validateEmail(signupEmail.value)) {
            signupEmailValidation.value = "Invalid email.";
            valid = false;
        }

        if (!validatePassword(signupPwd.value)) {
            signupPwdValidation.value = "Password must be at least 8 characters long, must contain at least one digit and at least one special character.";
            valid = false;
        }

        if (!validatePasswordAndConfirm(signupPwd.value, confirmPwd.value)) {
            signupPwdValidation.value = "Password and confirm password must be the same.";
            confirmPwdValidation.value = "Password and confirm password must be the same.";
            valid = false;
        }

        if (valid) {
            // TODO: send signup request to server
            console.log("Signup request sent to server.");
        } else {
            // TODO: show error message
            console.log("Signup request failed.");
        }

    });
}


/**
 * Make the first parameter active and the second inactive.
 * @param {HTMLElement} panelToActive panel to be active
 * @param {HTMLElement} panelToInactive panel to be inactive
 */
function openPanel(panelToActive, panelToInactive) {
    panelToActive.classList.remove("inactive");
    panelToActive.classList.add("active");

    panelToInactive.classList.remove("active");
    panelToInactive.classList.add("inactive");
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
 * Clear validation message of the given HTML element
 * @param {HTMLElement} validationElement HTML element to clear validation message
 */
function clearValidationMsg(validationElement) {
    validationElement.innerHTML = "";
}