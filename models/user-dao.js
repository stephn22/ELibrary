"use strict";

import { get, run } from '../db.js';
import { compareSync, hashSync } from 'bcrypt';
import { CUSTOMER } from '../entities/constants/user-type.js';

import User from '../entities/user.js';

// TODO: check

/**
 * Add user to database.
 * @param {User} user user to be created into db.
 * @returns {Promise.<number>} id of user created.
 */
 export function addUser (user) {
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO users (fname, lname, email, password, address, type) VALUES (?, ?, ?, ?, ?, ?)";

        user.password = hashSync(user.password, 10);

        run(query, [
            user.fname,
            user.lname,
            user.email,
            user.password,
            user.address,
            CUSTOMER], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(user.id);
                }
            });
    });
}

/**
 * Update an existing user.
 * @param {User} user user to be updated.
 * @returns {Promise.<number>} id of updated user.
 */
export function updateUser (user) {
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
}

/**
 * Delete user (by id).
 * @param {number} id id of user to be deleted.
 * @returns {Promise.<number>} id of customer deleted.
 */
export function deleteUser (id) {
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
}

/**
 * Find user by id.
 * @param {number} id id of user.
 * @returns {Promise.<number>} user
 */
export function getUserById (id) {
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
}

/**
 * Get user by email and password.
 * @param {string} email email of user.
 * @param {string} password password of user.
 * @returns {Promise.<User>} user.
 */
export function getUserByEmailAndPassword (email, password) {
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
}