const express = require("express");
const router = new express.Router();

const db = require("../db");
const ExpressError = require("../expressError");

/** GET /invoices => { invoices: [{id, comp_code}, ...] } */
router.get("/", async function (req, res, next) {
  try {
    const result = await db.query(
      `SELECT id, comp_code
       FROM invoices
       ORDER BY id`
    );
    return res.json({ invoices: result.rows });
  } catch (err) {
    return next(err);
  }
});

/** GET /invoices/:id
 *  => { invoice:
 *        { id, comp_code, amt, paid, add_date, paid_date,
 *          company: { code, name, description } } }
 *  404 if not found
 */
router.get("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;

    const invRes = await db.query(
      `SELECT id, comp_code, amt, paid, add_date, paid_date
       FROM invoices
       WHERE id = $1`,
      [id]
    );

    if (invRes.rows.length === 0) {
      throw new ExpressError(`Invoice not found: ${id}`, 404);
    }

    const invoice = invRes.rows[0];

    const compRes = await db.query(
      `SELECT code, name, description
       FROM companies
       WHERE code = $1`,
      [invoice.comp_code]
    );

    invoice.company = compRes.rows[0]; // assumes FK integrity
    return res.json({ invoice });
  } catch (err) {
    return next(err);
  }
});

/** POST /invoices
 *  body: { comp_code, amt }
 *  => { invoice: { id, comp_code, amt, paid, add_date, paid_date } }
 */
router.post("/", async function (req, res, next) {
  try {
    const { comp_code, amt } = req.body;
    if (!comp_code || amt == null) {
      throw new ExpressError("comp_code and amt are required", 400);
    }

    const result = await db.query(
      `INSERT INTO invoices (comp_code, amt)
       VALUES ($1, $2)
       RETURNING id, comp_code, amt, paid, add_date, paid_date`,
      [comp_code, amt]
    );

    return res.status(201).json({ invoice: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

/** PUT /invoices/:id
 *  body: { amt }
 *  => { invoice: { id, comp_code, amt, paid, add_date, paid_date } }
 *  404 if not found
 *  (Note: per your handout, only amt updates here.)
 */
router.put("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const { amt } = req.body;
    if (amt == null) {
      throw new ExpressError("amt is required", 400);
    }

    const result = await db.query(
      `UPDATE invoices
       SET amt = $1
       WHERE id = $2
       RETURNING id, comp_code, amt, paid, add_date, paid_date`,
      [amt, id]
    );

    if (result.rows.length === 0) {
      throw new ExpressError(`Invoice not found: ${id}`, 404);
    }

    return res.json({ invoice: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /invoices/:id
 *  => { status: "deleted" }
 *  404 if not found
 */
router.delete("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;

    const result = await db.query(
      `DELETE FROM invoices
       WHERE id = $1
       RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new ExpressError(`Invoice not found: ${id}`, 404);
    }

    return res.json({ status: "deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;