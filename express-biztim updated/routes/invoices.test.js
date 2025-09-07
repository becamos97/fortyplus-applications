process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const db = require("../db");

let invId;

beforeEach(async () => {
  await db.query("DELETE FROM companies_industries");
  await db.query("DELETE FROM industries");
  await db.query("DELETE FROM invoices");
  await db.query("DELETE FROM companies");

  await db.query(
    `INSERT INTO companies (code, name, description)
     VALUES ('apple','Apple','Maker of iPhones')`
  );
  const inv = await db.query(
    `INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date)
     VALUES ('apple', 100, false, CURRENT_DATE, null)
     RETURNING id`
  );
  invId = inv.rows[0].id;
});

afterAll(async () => {
  await db.end();
});

describe("PUT /invoices/:id", () => {
  test("paying sets paid_date", async () => {
    const resp = await request(app)
      .put(`/invoices/${invId}`)
      .send({ amt: 150, paid: true });
    expect(resp.statusCode).toBe(200);
    expect(resp.body.invoice.paid).toBe(true);
    expect(resp.body.invoice.amt).toBe(150);
    expect(resp.body.invoice.paid_date).not.toBeNull();
  });

  test("un-paying clears paid_date", async () => {
    // first pay it
    await db.query(`UPDATE invoices SET paid=true, paid_date=CURRENT_DATE WHERE id=$1`, [invId]);

    const resp = await request(app)
      .put(`/invoices/${invId}`)
      .send({ amt: 200, paid: false });

    expect(resp.statusCode).toBe(200);
    expect(resp.body.invoice.paid).toBe(false);
    expect(resp.body.invoice.paid_date).toBeNull();
  });

  test("404 on missing invoice", async () => {
    const resp = await request(app)
      .put(`/invoices/0`)
      .send({ amt: 50, paid: true });
    expect(resp.statusCode).toBe(404);
  });
});