/** Database config for database. */

const { Client } = require("pg");
const { DB_URI } = require("./config");

const db = new Client({
  connectionString: DB_URI,
  host: "/var/run/postgresql",                  // <-- force Unix socket (peer)
  user: process.env.PGUSER || process.env.USER, // <-- likely "brandon"
  // no password on purpose (peer auth)
});

db.connect();

module.exports = db;