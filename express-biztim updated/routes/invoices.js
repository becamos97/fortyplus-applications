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

/** GET /invoices/:id => { invoice: {..., company: {...}} } */
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

    invoice.company = compRes.rows[0];
    return res.json({ invoice });
  } catch (err) {
    return next(err);
  }
});

/** POST /invoices => { invoice: {...} } */
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
 *  body: { amt, paid }
 *  Rules:
 *   - paying previously-unpaid => paid_date = today
 *   - un-paying previously-paid => paid_date = null
 *   - else keep current paid_date
 */
router.put("/:id", async function (req, res, next) {                   // <-- CHANGED
  try {
    const { id } = req.params;
    const { amt, paid } = req.body;

    if (amt == null || typeof paid === "undefined") {
      throw new ExpressError("amt and paid are required", 400);
    }

    // get current invoice
    const curRes = await db.query(
      `SELECT paid, paid_date
       FROM invoices
       WHERE id = $1`,
      [id]
    );
    if (curRes.rows.length === 0) {
      throw new ExpressError(`Invoice not found: ${id}`, 404);
    }

    const curPaid = curRes.rows[0].paid;
    const curPaidDate = curRes.rows[0].paid_date;

    let paidDate = curPaidDate;

    if (!curPaid && paid === true) {
      // paying now
      paidDate = new Date();
    } else if (curPaid && paid === false) {
      // un-paying now
      paidDate = null;
    } // else: leave as-is

    const result = await db.query(
      `UPDATE invoices
       SET amt = $1, paid = $2, paid_date = $3
       WHERE id = $4
       RETURNING id, comp_code, amt, paid, add_date, paid_date`,
      [amt, paid, paidDate, id]
    );

    return res.json({ invoice: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /invoices/:id => { status: "deleted" } */
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