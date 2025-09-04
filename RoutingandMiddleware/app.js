const express = require("express");
const ExpressError = require("./expressError");
const itemsRoutes = require("./routes/items");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/items", itemsRoutes);

/** 404 handler */
app.use(function notFound(req, res, next) {
  return next(new ExpressError("Not Found", 404));
});

/** generic error handler */
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  return res.status(status).json({ error: err.message });
});

module.exports = app;