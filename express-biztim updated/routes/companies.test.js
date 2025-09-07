// connect to right DB before loading app/db
process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const db = require("../db");

beforeAll(async () => {
  // ensure tables exist for industries m:m
  await db.query(`
    CREATE TABLE IF NOT EXISTS industries (
      code TEXT PRIMARY KEY,
      industry TEXT UNIQUE NOT NULL
    );
    CREATE TABLE IF NOT EXISTS companies_industries (
      comp_code TEXT NOT NULL REFERENCES companies(code) ON DELETE CASCADE,
      ind_code  TEXT NOT NULL REFERENCES industries(code) ON DELETE CASCADE,
      PRIMARY KEY (comp_code, ind_code)
    );
  `);
});

beforeEach(async () => {
  await db.query("DELETE FROM companies_industries");
  await db.query("DELETE FROM industries");
  await db.query("DELETE FROM invoices");
  await db.query("DELETE FROM companies");

  await db.query(
    `INSERT INTO companies (code, name, description)
     VALUES ('apple','Apple','Maker of iPhones')`
  );
  await db.query(
    `INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date)
     VALUES ('apple', 100, false, CURRENT_DATE, null)`
  );
  await db.query(
    `INSERT INTO industries (code, industry)
     VALUES ('tech','Technology')`
  );
  await db.query(
    `INSERT INTO companies_industries (comp_code, ind_code)
     VALUES ('apple','tech')`
  );
});

afterAll(async () => {
  await db.end();
});

describe("GET /companies", () => {
  test("lists companies", async () => {
    const resp = await request(app).get("/companies");
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ companies: [{ code: "apple", name: "Apple" }] });
  });
});

describe("GET /companies/:code", () => {
  test("gets one with invoices + industries", async () => {
    const resp = await request(app).get("/companies/apple");
    expect(resp.statusCode).toBe(200);
    expect(resp.body.company.code).toBe("apple");
    expect(resp.body.company.invoices).toEqual(expect.any(Array));
    expect(resp.body.company.industries).toContain("Technology");
  });

  test("404 on missing", async () => {
    const resp = await request(app).get("/companies/nope");
    expect(resp.statusCode).toBe(404);
  });
});

describe("POST /companies (slugify)", () => {
  test("creates with slugified code", async () => {
    const resp = await request(app)
      .post("/companies")
      .send({ name: "New Co, Inc.", description: "fresh" });
    expect(resp.statusCode).toBe(201);
    expect(resp.body.company).toEqual({
      code: "new-co-inc",
      name: "New Co, Inc.",
      description: "fresh",
    });
  });
});