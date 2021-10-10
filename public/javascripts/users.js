"use strict";

/************************** CONSTANTS *****************************/

const deleteBtns = document.querySelectorAll('.delete');

/************************** EVENT LISTENERS *****************************/

for (let i = 0; i < deleteBtns.length; i++) {
    deleteBtns[i].addEventListener('click', () => {
        const id = deleteBtns[i].getAttribute('data-id');

        deleteUser(parseInt(id));
    });
}

/************************** FETCH API *****************************/

/**
 * Using fetch API to delete an user
 * @param {number} id id of the user to delete
 */
function deleteUser(id) {
    fetch(`/users/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((_res) => window.location.reload())
        .catch(err => console.log(err));
}