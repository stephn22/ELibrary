"use strict";

const db = require('../db');
const crypt = require('bcrypt');
const Type = require('../entities/constants/user-type');

const User = require('../entities/user');

/**
 * Add user to database.
 * @param {User} user user to be created into db.
 * @returns {Promise.<number>} id of user inserted.
 */
function addUser(user) {
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO users (fname, lname, email, password, address_id, type) VALUES (?, ?, ?, ?, ?, ?)";

        user.password = crypt.hashSync(user.password, 10);

        db.run(query, [
            user.firstname,
            user.lastname,
            user.email,
            user.password,
            user.address_id,
            Type.CUSTOMER], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.lastID);
                }
            });
    });
};

/**
 * Update an existing user.
 * @param {User} user user to be updated.
 * @returns {Promise.<number>} id of updated user.
 */
function updateUser(user) {
    return new Promise((resolve, reject) => {
        const query = "UPDATE users SET fname = ?, lname = ?, email = ?, password = ?, address_id = ?, type = ? WHERE id = ?";
        user.password = crypt.hashSync(user.password, 10);

        db.run(query, [
            user.firstname,
            user.lastname,
            user.email,
            user.password,
            user.address_id,
            user.type,
            user.id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(user.id);
                }
            });
    });
};

/**
 * Delete user (by id).
 * @param {number} id id of user to be deleted.
 * @returns {Promise.<number>} id of customer deleted.
 */
function deleteUser(id) {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM users WHERE id = ?";

        db.run(query, [id], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(id);
            }
        });
    });
};

/**
 * Find user by id.
 * @param {number} id id of user.
 * @returns {Promise.<User>} user
 */
function findUserById(id) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM users WHERE id = ?";

        db.get(query, [id], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve({ error: "User not found" });
            } else {
                // no need to add password to user object
                const user = new User(
                    row.id,
                    row.fname,
                    row.lname,
                    row.email,
                    undefined,
                    row.address_id,
                    row.type);

                resolve(user);
            }
        });
    });
};

/**
 * Get user by email.
 * @param {string} email email of user.
 * @returns {Promise.<User>} user
 */
function findUserByEmail(email) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM users WHERE email = ?";

        db.get(query, [email], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve({ error: "User not found" });
            } else {
                const user = new User(
                    row.id,
                    row.fname,
                    row.lname,
                    row.email,
                    undefined,
                    row.address_id,
                    row.type);

                resolve(user);
            }
        });
    });
};

/**
 * Get user by email and password.
 * @param {string} email email of user.
 * @param {string} password password of user.
 * @returns {Promise.<User>} user.
 */
function findUserByEmailAndPassword(email, password) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM users WHERE email = ?";

        db.get(query, [email], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve({ error: "User not found" });
            } else {
                // no need to add password to user object
                const user = new User(row.id, row.fname, row.lname, row.email, undefined, row.address_id, row.type);

                const check = crypt.compareSync(password, row.password);

                resolve({ user, check });
            }
        });
    });
};

module.exports = { addUser, updateUser, deleteUser, findUserById, findUserByEmail, findUserByEmailAndPassword };