
"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const ExpressError = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config");

/** User class for message.ly */
class User {
  /** Register new user
   *  data: { username, password, first_name, last_name, phone }
   *  returns { username, first_name, last_name, phone }
   *
   *  (password is hashed before saving)
   */
  static async register({ username, password, first_name, last_name, phone }) {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
         (username, password, first_name, last_name, phone, join_at, last_login_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING username, first_name, last_name, phone`,
      [username, hashedPassword, first_name, last_name, phone]
    );

    return result.rows[0];
  }

  /** Authenticate: is this username/password valid? Returns boolean. */
  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT username, password
         FROM users
         WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];
    if (!user) return false;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid === true;
  }

  /** Update last_login_at for user; throws 404 if user not found */
  static async updateLoginTimestamp(username) {
    const result = await db.query(
      `UPDATE users
         SET last_login_at = CURRENT_TIMESTAMP
       WHERE username = $1
       RETURNING username`,
      [username]
    );
    const user = result.rows[0];
    if (!user) throw new ExpressError("User not found", 404);
  }

  /** All: [{username, first_name, last_name, phone}, ...] */
  static async all() {
    const result = await db.query(
      `SELECT username, first_name, last_name, phone
         FROM users
         ORDER BY username`
    );
    return result.rows;
  }

  /** Get single user or 404.
   * returns {username, first_name, last_name, phone, join_at, last_login_at}
   */
  static async get(username) {
    const result = await db.query(
      `SELECT username,
              first_name,
              last_name,
              phone,
              join_at,
              last_login_at
         FROM users
         WHERE username = $1`,
      [username]
    );
    const user = result.rows[0];
    if (!user) throw new ExpressError("User not found", 404);
    return user;
  }

  /** Messages FROM this user.
   * returns [{id, to_user, body, sent_at, read_at}], where to_user is
   *   {username, first_name, last_name, phone}
   */
  static async messagesFrom(username) {
    // 404 if user doesn't exist (spec says methods that act on user should throw)
    await this.get(username);

    const result = await db.query(
      `SELECT m.id,
              m.body,
              m.sent_at,
              m.read_at,
              u.username AS to_username,
              u.first_name AS to_first_name,
              u.last_name  AS to_last_name,
              u.phone      AS to_phone
         FROM messages AS m
           JOIN users AS u
             ON m.to_username = u.username
        WHERE m.from_username = $1
        ORDER BY m.sent_at DESC`,
      [username]
    );

    return result.rows.map((r) => ({
      id: r.id,
      to_user: {
        username: r.to_username,
        first_name: r.to_first_name,
        last_name: r.to_last_name,
        phone: r.to_phone,
      },
      body: r.body,
      sent_at: r.sent_at,
      read_at: r.read_at,
    }));
  }

  /** Messages TO this user.
   * returns [{id, from_user, body, sent_at, read_at}], where from_user is
   *   {username, first_name, last_name, phone}
   */
  static async messagesTo(username) {
    // 404 if user doesn't exist
    await this.get(username);

    const result = await db.query(
      `SELECT m.id,
              m.body,
              m.sent_at,
              m.read_at,
              u.username AS from_username,
              u.first_name AS from_first_name,
              u.last_name  AS from_last_name,
              u.phone      AS from_phone
         FROM messages AS m
           JOIN users AS u
             ON m.from_username = u.username
        WHERE m.to_username = $1
        ORDER BY m.sent_at DESC`,
      [username]
    );

    return result.rows.map((r) => ({
      id: r.id,
      from_user: {
        username: r.from_username,
        first_name: r.from_first_name,
        last_name: r.from_last_name,
        phone: r.from_phone,
      },
      body: r.body,
      sent_at: r.sent_at,
      read_at: r.read_at,
    }));
  }
}

module.exports = User;