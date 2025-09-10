"use strict";

const express = require("express");
const router = new express.Router();
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const ExpressError = require("../expressError");
const { SECRET_KEY } = require("../config");

/** POST /login: { username, password } => { token }
 *
 * Make sure to update their last-login!
 **/
router.post("/login", async function (req, res, next) {
  try {
    const { username, password } = req.body;
    const isValid = await User.authenticate(username, password);
    if (!isValid) throw new ExpressError("Invalid user/password", 400);

    await User.updateLoginTimestamp(username);

    const token = jwt.sign({ username }, SECRET_KEY);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

/** POST /register: { username, password, first_name, last_name, phone } => { token }
 *
 * Registers, logs in, and returns token.
 * Make sure to update their last-login!
 */
router.post("/register", async function (req, res, next) {
  try {
    const { username, password, first_name, last_name, phone } = req.body;
    await User.register({ username, password, first_name, last_name, phone });

    // ensure last_login_at is current (register sets it, but spec says "make sure")
    await User.updateLoginTimestamp(username);

    const token = jwt.sign({ username }, SECRET_KEY);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;


/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
