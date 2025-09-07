const express = require("express");
const router = new express.Router();

const db = require("../db");
const ExpressError = require("../expressError");

/** GET /companies => { companies: [{code, name}, ...] } */
router.get("/", async function (req, res, next) {
  try {
    const result = await db.query(
      `SELECT code, name
       FROM companies
       ORDER BY code`
    );
    return res.json({ companies: result.rows });
  } catch (err) {
    return next(err);
  }
});

/** GET /companies/:code
 *  => { company: { code, name, description, invoices: [id, ...] } }
 *  404 if not found
 */
router.get("/:code", async function (req, res, next) {
  try {
    const { code } = req.params;

    const compRes = await db.query(
      `SELECT code, name, description
       FROM companies
       WHERE code = $1`,
      [code]
    );
    if (compRes.rows.length === 0) {
      throw new ExpressError(`Company not found: ${code}`, 404);
    }

    const invRes = await db.query(
      `SELECT id
       FROM invoices
       WHERE comp_code = $1
       ORDER BY id`,
      [code]
    );

    const company = compRes.rows[0];
    company.invoices = invRes.rows.map((r) => r.id);

    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});

/** POST /companies
 *  body: { code, name, description }
 *  => { company: { code, name, description } }
 */
router.post("/", async function (req, res, next) {
  try {
    const { code, name, description } = req.body;
    if (!code || !name) {
      throw new ExpressError("code and name are required", 400);
    }

    const result = await db.query(
      `INSERT INTO companies (code, name, description)
       VALUES ($1, $2, $3)
       RETURNING code, name, description`,
      [code, name, description || null]
    );

    return res.status(201).json({ company: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

/** PUT /companies/:code
 *  body: { name, description }
 *  => { company: { code, name, description } }
 *  404 if not found
 */
router.put("/:code", async function (req, res, next) {
  try {
    const { code } = req.params;
    const { name, description } = req.body;

    const result = await db.query(
      `UPDATE companies
       SET name = $1,
           description = $2
       WHERE code = $3
       RETURNING code, name, description`,
      [name, description || null, code]
    );

    if (result.rows.length === 0) {
      throw new ExpressError(`Company not found: ${code}`, 404);
    }

    return res.json({ company: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /companies/:code
 *  => { status: "deleted" }
 *  404 if not found
 */
router.delete("/:code", async function (req, res, next) {
  try {
    const { code } = req.params;

    const result = await db.query(
      `DELETE FROM companies
       WHERE code = $1
       RETURNING code`,
      [code]
    );

    if (result.rows.length === 0) {
      throw new ExpressError(`Company not found: ${code}`, 404);
    }

    return res.json({ status: "deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;