"use strict";

/************************** CONSTANTS *****************************/

/**
 * @type {HTMLSelectElement}
 */
const firstSelect = document.getElementById('first-select');

/**
 * @type {HTMLSelectElement}
 */
const secondSelect = document.getElementById('second-select');

/**
 * @type {HTMLSelectElement}
 */
const thirdSelect = document.getElementById('third-select');

/**
 * @type {HTMLButtonElement}
 */
const save = document.getElementById('save-features');

/************************** EVENT LISTENERS *****************************/

if (save) {
    disableBtn(save);
}

if (firstSelect && secondSelect && thirdSelect) {
    firstSelect.addEventListener("change", () => {
        hideIfSelected(secondSelect.options, firstSelect.selectedIndex, thirdSelect.selectedIndex);
        hideIfSelected(thirdSelect.options, firstSelect.selectedIndex, secondSelect.selectedIndex);

        if (firstSelect.value === "---" || secondSelect.value === "---" || thirdSelect.value === "---") {
            disableBtn(save);
        } else {
            enableBtn(save);
        }
    });

    secondSelect.addEventListener("change", () => {
        hideIfSelected(firstSelect.options, secondSelect.selectedIndex, thirdSelect.selectedIndex);
        hideIfSelected(thirdSelect.options, secondSelect.selectedIndex, firstSelect.selectedIndex);

        if (firstSelect.value === "---" || secondSelect.value === "---" || thirdSelect.value === "---") {
            disableBtn(save);
        } else {
            enableBtn(save);
        }
    });

    thirdSelect.addEventListener("change", () => {
        hideIfSelected(firstSelect.options, thirdSelect.selectedIndex, secondSelect.selectedIndex);
        hideIfSelected(secondSelect.options, thirdSelect.selectedIndex, firstSelect.selectedIndex);

        if (firstSelect.value === "---" || secondSelect.value === "---" || thirdSelect.value === "---") {
            disableBtn(save);
        } else {
            enableBtn(save);
        }
    });
}

/************************** OTHER *****************************/

/**
 * If an option is selected, hide the same option in the select lists
 * @param {HTMLOptionsCollection} options collection of options
 * @param {number} firstIndex index of the selected option
 * @param {number} secondIndex index of the selected option
 */
function hideIfSelected(options, firstIndex, secondIndex) {
    for (let i = 0; i < options.length; i++) {
        if (options[i].index === firstIndex) {
            hideItem(options[i]);
        } else if (options[i].index === secondIndex) {
            hideItem(options[i]);
        } else {
            showItem(options[i]);
        }
    }
}

/**
 * Hides an item
 * @param {HTMLOptionElement} item item to be hidden
 */
function hideItem(item) {
    item.setAttribute("hidden", "");
}

/**
 * Shows an item
 * @param {Element} item item to be shown
 */
function showItem(item) {
    item.removeAttribute("hidden");
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
    btn.setAttribute("disabled", "disabled");
}