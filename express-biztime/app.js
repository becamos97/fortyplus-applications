/** BizTime express application. */


const express = require("express");
const app = express();

const ExpressError = require("./expressError");

const companiesRoutes = require("./routes/companies");
const invoicesRoutes = require("./routes/invoices");

app.use(express.json()); // parse JSON bodies

app.use("/companies", companiesRoutes);
app.use("/invoices", invoicesRoutes);

/** 404 handler */
app.use(function (req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
