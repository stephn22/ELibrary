"use strict";

const db = require('../db.js');
const crypt = require('bcrypt');
const userType = require('../entities/constants/user-type');

const User = require('../entities/user');


// TODO: check promises

/**
 * Find user by id.
 * @param {*} id of user.
 * @returns user
 */
exports.getUserById = function (id) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM users WHERE id = ?";

        db.get(query, [id], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve({ error: "User not found" });
            } else {
                // no need to add password to user object
                const user = new User(row.id, row.fname, row.lname, row.email, undefined, row.address, row.type);
                resolve(user);
            }
        });
    });
};

/**
 * Get user by email and password.
 * @param {*} email of user.
 * @param {*} password of user.
 * @returns user
 */
exports.getUserByEmailAndPassword = function (email, password) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM users WHERE email = ?";

        db.get(query, [email], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve({ error: "User not found" });
            } else {
                // no need to add password to user object
                const user = new User(row.id, row.fname, row.lname, row.email, undefined, row.address, row.type);

                const check = crypt.compareSync(password, row.password);

                resolve({ user, check });
            }
        });
    });
};

/**
 * Create user.
 * @param {*} user to be created into db.
 * @returns id of user created.
 */
exports.createUser = function (user) {
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO users (fname, lname, email, password, address, type) VALUES (?, ?, ?, ?, ?, ?)";

        user.password = crypt.hashSync(user.password, 10);

        db.run(query, [
            user.fname,
            user.lname,
            user.email,
            user.password,
            user.address,
            userType.CUSTOMER], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.id);
                }
            });
    });
};

/**
 * Update an existing user.
 * @param {*} user to be updated.
 * @returns id of updated user.
 */
exports.updateUser = function (user) {
    return new Promise((resolve, reject) => {
        const query = "UPDATE users SET fname = ?, lname = ?, email = ?, password = ?, address = ?, type = ? WHERE id = ?";
        user.password = crypt.hashSync(user.password, 10);

        db.run(query, [
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
                    resolve(this.id);
                }
            });
    });
};

/**
 * Delete user (by id).
 * @param {*} id id of user to be deleted.
 * @returns 
 */
exports.deleteUser = function (id) {
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