/** App for Lunchly */

const express = require("express");
const nunjucks = require("nunjucks");

const app = express();

app.use(express.urlencoded({ extended: true })); // parse form-encoded bodies
app.use(express.json()); // (only if you add JSON endpoints)

nunjucks.configure("templates", {
  autoescape: true,
  express: app,
  noCache: true,
});

// routes
const routes = require("./routes");
app.use(routes);

// 404
app.use(function (req, res, next) {
  return res.status(404).render("404.html");
});

// generic error
app.use(function (err, req, res, next) {
  console.error(err.stack);
  return res.status(500).send("Something broke!");
});

module.exports = app;