"use strict";

const db = require('../db');
const crypt = require('bcrypt');
const Type = require('../entities/constants/user-type');

const User = require('../entities/user');

/**
 * Add user to database.
 * @param {User} user user to be created into db.
 * @returns {Promise.<number>} id of user created.
 */
function addUser(user) {
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO users (fname, lname, email, password, address, type) VALUES (?, ?, ?, ?, ?, ?)";

        user.password = hashSync(user.password, 10);

        db.run(query, [
            user.fname,
            user.lname,
            user.email,
            user.password,
            user.address,
            Type.CUSTOMER], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(user.id);
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
        const query = "UPDATE users SET fname = ?, lname = ?, email = ?, password = ?, address = ?, type = ? WHERE id = ?";
        user.password = hashSync(user.password, 10);

        run(query, [
            user.fname,
            user.lname,
            user.email,
            user.password,
            user.address,
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

        run(query, [id], (err) => {
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
function getUserById(id) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM users WHERE id = ?";

        get(query, [id], (err, row) => {
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
                    row.address,
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
function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM users WHERE email = ?";

        get(query, [email], (err, row) => {
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
                    row.address,
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
function getUserByEmailAndPassword(email, password) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM users WHERE email = ?";

        get(query, [email], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve({ error: "User not found" });
            } else {
                // no need to add password to user object
                const user = new User(row.id, row.fname, row.lname, row.email, undefined, row.address, row.type);

                const check = compareSync(password, row.password);

                resolve({ user, check });
            }
        });
    });
};

module.exports = { addUser, updateUser, deleteUser, getUserById, getUserByEmail, getUserByEmailAndPassword };