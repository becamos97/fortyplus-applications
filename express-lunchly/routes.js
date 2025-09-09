/** Web (server-rendered) routes for Lunchly */

const express = require("express");
const router = new express.Router();

const Customer = require("./models/customer");
const Reservation = require("./models/reservation");

/** Home -> list customers (with optional search) — Part Seven */
router.get("/", async function (req, res, next) {
  try {
    const q = (req.query.q || "").trim();
    const customers = q ? await Customer.searchByName(q) : await Customer.all();
    return res.render("customer_list.html", { customers, q });
  } catch (err) {
    return next(err);
  }
});

/** Best customers — Part Eight */
router.get("/best", async function (req, res, next) {
  try {
    const customers = await Customer.bestCustomers(10);
    return res.render("customer_best.html", { customers });
  } catch (err) {
    return next(err);
  }
});

/** Add customer form */
router.get("/add", async function (req, res, next) {
  return res.render("customer_new_form.html");
});

/** Add customer submit */
router.post("/add", async function (req, res, next) {
  try {
    const c = new Customer({
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      phone: req.body.phone || null,
      notes: req.body.notes || "",
    });
    await c.save();
    return res.redirect(`/${c.id}`);
  } catch (err) {
    return next(err);
  }
});

/** Customer detail */
router.get("/:id", async function (req, res, next) {
  try {
    const customer = await Customer.get(req.params.id);
    const reservations = await customer.getReservations();
    return res.render("customer_detail.html", { customer, reservations });
  } catch (err) {
    return next(err);
  }
});

/** Customer edit form */
router.get("/:id/edit", async function (req, res, next) {
  try {
    const customer = await Customer.get(req.params.id);
    return res.render("customer_edit_form.html", { customer });
  } catch (err) {
    return next(err);
  }
});

/** Customer edit submit */
router.post("/:id/edit", async function (req, res, next) {
  try {
    const customer = await Customer.get(req.params.id);
    customer.firstName = req.body.firstName;
    customer.lastName = req.body.lastName;
    customer.phone = req.body.phone || null;
    customer.notes = req.body.notes || "";
    await customer.save();
    return res.redirect(`/${customer.id}`);
  } catch (err) {
    return next(err);
  }
});

/** Add reservation (for a customer) — Part Six */
router.post("/:id/add-reservation", async function (req, res, next) {
  try {
    const startAt = new Date(req.body.startAt);
    const numGuests = Number(req.body.numGuests);
    const notes = req.body.notes || "";

    const r = new Reservation({
      customer_id: Number(req.params.id),
      start_at: startAt,
      num_guests: numGuests,
      notes,
    });
    await r.save();
    return res.redirect(`/${req.params.id}`);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;