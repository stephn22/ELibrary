"use strict";

/************************** CONSTANTS *****************************/

const signupBtn = document.getElementById("signup-btn");

// modal
const addressInputMsg = "Click the button below to insert your location";
const addressBtn = document.getElementById("address-search");
const addressInput = document.getElementById("address-input");
const modalText = document.getElementById("modal-text");
const saveModalBtn = document.getElementById("address-save-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const closeModal = document.getElementById("close-modal");

const fname = document.getElementById("fname");
const fnameValidation = document.getElementById("fname-validation");
const lname = document.getElementById("lname");
const lnameValidation = document.getElementById("lname-validation");

const signupEmail = document.getElementById("signup-email");
const signupEmailValidation = document.getElementById("signup-email-validation");

const signupPwd = document.getElementById("signup-password");
const signupPwdValidation = document.getElementById("signup-password-validation");
const confirmPwd = document.getElementById("confirm-password");
const confirmPwdValidation = document.getElementById("confirm-password-validation");

/************************** EVENT LISTENERS *****************************/

let valid = true;

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

// on click of address button
addressBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        // get the user's current position (lng, lat)
        navigator.geolocation.getCurrentPosition(reverseGeocode, geolocationError);
    }
});

// on click of close modal button
closeModalBtn.addEventListener("click", () => {
    // reset input value
    addressInput.value = addressInputMsg;
});

// on click of close modal icon (button)
closeModal.addEventListener("click", () => {
    // reset input value
    addressInput.value = addressInputMsg;
});

signupBtn.addEventListener("click", (e) => {
    if (!valid) {
        e.preventDefault();
    }
});


/************************** VALIDATION METHODS *****************************/

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

/************************** GEOLOCATION METHODS *****************************/

/**
 * Get the address position of user by reverse geocoding request (lng, lat) to MapBox
 * @link https://docs.mapbox.com/api/search/geocoding/
 * @param {GeolocationPosition} position position of the user
 */
async function reverseGeocode(position) {
    const mapboxAccessToken = "pk.eyJ1Ijoic3RlY3JvdHRpMSIsImEiOiJja3Bna2kzbHYyaThoMm9ueHl1dzlnaTc1In0.EpALSOaDOmuM8XGS_IQzvA";
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${position.coords.longitude},${position.coords.latitude}.json?access_token=${mapboxAccessToken}`;

    await updateAddressModal(url);
}

/**
 * Show errors of geolocation
 * @param {GeolocationPositionError} error geolocation error object
 */
function geolocationError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            window.alert("User denied the request for Geolocation.");
            break;

        case error.POSITION_UNAVAILABLE:
            window.alert("Location information is unavailable.");
            break;

        case error.TIMEOUT:
            window.alert("The request to get user location timed out.");
            break;

        case error.UNKNOWN_ERROR:
            window.alert("An unknown error occurred.");
            break;
    }
}

/**
 * Make a http request to the given url and then update the address modal with the result
 * @param {string} url url to make request
 */
async function updateAddressModal(url) {
    await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        },
    }).then(response => {
        return response.json();
    }).then(data => {
        // update address modal and the address input field
        modalText.innerHTML = data.features[0].place_name;
        addressInput.value = data.features[0].place_name;

    }).catch(error => {
        console.log(error);
    });
}
