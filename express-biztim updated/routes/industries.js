const express = require("express");
const router = new express.Router();

const db = require("../db");
const ExpressError = require("../expressError");

/** GET /industries
 *  => { industries: [{ code, industry, companies: [comp_code,...] }, ...] }
 */
router.get("/", async function (req, res, next) {
  try {
    const result = await db.query(
      `SELECT i.code AS ind_code,
              i.industry,
              ci.comp_code
       FROM industries AS i
       LEFT JOIN companies_industries AS ci
         ON i.code = ci.ind_code
       ORDER BY i.code, ci.comp_code`
    );

    const map = new Map();
    for (let row of result.rows) {
      if (!map.has(row.ind_code)) {
        map.set(row.ind_code, {
          code: row.ind_code,
          industry: row.industry,
          companies: [],
        });
      }
      if (row.comp_code) map.get(row.ind_code).companies.push(row.comp_code);
    }

    return res.json({ industries: Array.from(map.values()) });
  } catch (err) {
    return next(err);
  }
});

/** POST /industries
 *  body: { code, industry }
 *  => { industry: { code, industry } }
 */
router.post("/", async function (req, res, next) {
  try {
    const { code, industry } = req.body;
    if (!code || !industry) {
      throw new ExpressError("code and industry are required", 400);
    }

    const result = await db.query(
      `INSERT INTO industries (code, industry)
       VALUES ($1, $2)
       RETURNING code, industry`,
      [code, industry]
    );

    return res.status(201).json({ industry: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

/** POST /industries/:code/companies
 *  body: { company_code }
 *  => { added: { comp_code, ind_code } }
 */
router.post("/:code/companies", async function (req, res, next) {
  try {
    const indCode = req.params.code;
    const { company_code } = req.body;
    if (!company_code) {
      throw new ExpressError("company_code is required", 400);
    }

    // ensure both exist
    const [indCheck, compCheck] = await Promise.all([
      db.query(`SELECT code FROM industries WHERE code = $1`, [indCode]),
      db.query(`SELECT code FROM companies WHERE code = $1`, [company_code]),
    ]);
    if (indCheck.rows.length === 0) {
      throw new ExpressError(`Industry not found: ${indCode}`, 404);
    }
    if (compCheck.rows.length === 0) {
      throw new ExpressError(`Company not found: ${company_code}`, 404);
    }

    const result = await db.query(
      `INSERT INTO companies_industries (comp_code, ind_code)
       VALUES ($1, $2)
       ON CONFLICT (comp_code, ind_code) DO NOTHING
       RETURNING comp_code, ind_code`,
      [company_code, indCode]
    );

    if (result.rows.length === 0) {
      return res.json({ added: { comp_code: company_code, ind_code: indCode } });
    }

    return res.status(201).json({ added: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;