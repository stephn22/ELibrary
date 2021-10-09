"use strict";

const db = require('../db');
const crypt = require('bcrypt');
const User = require('../entities/user');
const logger = require('../util/logger');

/**
 * Add user to database.
 * @param {User} user user to be created into db.
 * @returns {Promise<number>} id of user inserted.
 */
function addUser(user) {
    return new Promise(async (resolve, reject) => {
        const query = "INSERT INTO users (fname, lname, email, password, type) VALUES (?, ?, ?, ?, ?)";

        user.password = await crypt.hash(user.password, 10);

        db.run(query, [
            user.firstname,
            user.lastname,
            user.email,
            user.password,
            user.type], function (err) {
                if (err) {
                    logger.logError(err);
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
    });
}

/**
 * Update an existing user.
 * @param {User} user user to be updated.
 * @param {string} newPassword new password of user.
 * @returns {Promise<number>} id of updated user.
 */
function updateUser(user, newPassword = null) {
    return new Promise(async (resolve, reject) => {
        if (newPassword !== null) {
            user.password = await crypt.hash(newPassword, 10);

            const query = "UPDATE users SET fname = ?, lname = ?, email = ?, password = ?, type = ? WHERE id = ?"

            db.run(query, [
                user.firstname,
                user.lastname,
                user.email,
                user.password,
                user.type,
                user.id], (err) => {
                    if (err) {
                        logger.logError(err);
                        reject(err);
                    } else {
                        resolve(user.id);
                    }
                });
        } else {
            const query = "UPDATE users SET fname = ?, lname = ?, email = ?, type = ? WHERE id = ?";

            db.run(query, [
                user.firstname,
                user.lastname,
                user.email,
                user.type,
                user.id], (err) => {
                    if (err) {
                        logger.logError(err);
                        reject(err);
                    } else {
                        resolve(user.id);
                    }
                });
        }


    });
}

/**
 * Delete user (by id).
 * @param {number} id id of user to be deleted.
 * @returns {Promise<number>} id of customer deleted.
 */
function deleteUser(id) {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM users WHERE id = ?";

        db.run(query, [id], function (err) {
            if (err) {
                logger.logError(err);
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
 * @returns {Promise<User>} user
 */
function findUserById(id) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM users WHERE id = ?";

        db.get(query, [id], function (err, row) {
            if (err) {
                logger.logError(err);
                reject(err);
            } else if (row === undefined) {
                logger.logWarn(`No such user with id: ${id}`);
                resolve({ error: "User not found" });
            } else {
                const user = new User(
                    row.id,
                    row.fname,
                    row.lname,
                    row.email,
                    row.password,
                    row.type);

                resolve(user);
            }
        });
    });
}

/**
 * Get user by email.
 * @param {string} email email of user.
 * @returns {Promise<User>} user
 */
function findUserByEmail(email) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM users WHERE email = ?";

        db.get(query, [email], function (err, row) {
            if (err) {
                logger.logError(err);
                reject(err);
            } else if (row === undefined) {
                logger.logWarn(`No such user with email: ${email}`);
                resolve({ error: "User not found" });
            } else {
                const user = new User(
                    row.id,
                    row.fname,
                    row.lname,
                    row.email,
                    row.password,
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
 * @returns {Promise<User>} user.
 */
function findUserByEmailAndPassword(email, password) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM users WHERE email = ?";

        db.get(query, [email], async function (err, row) {
            if (err) {
                logger.logError(err);
                reject(err);
            } else if (row === undefined) {
                logger.logWarn(`No such user with email: ${email}`);
                resolve({ error: "User not found" });
            } else {
                const user = new User(
                    row.id,
                    row.fname,
                    row.lname,
                    row.email,
                    row.password,
                    row.type);

                const check = await crypt.compare(password, row.password);

                resolve({ user, check });
            }
        });
    });
}

module.exports = { addUser, updateUser, deleteUser, findUserById, findUserByEmail, findUserByEmailAndPassword };