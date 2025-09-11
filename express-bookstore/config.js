/** Common config for bookstore. */

require("dotenv").config();

let DB_URI;

if (process.env.NODE_ENV === "test") {
  DB_URI = process.env.TEST_DATABASE_URL || "postgresql:///express_bookstore_test";
} else {
  DB_URI = process.env.DATABASE_URL || "postgresql:///express_bookstore";
}

module.exports = { DB_URI };