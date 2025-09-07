process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const db = require("../db");

beforeAll(async () => {
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
    `INSERT INTO industries (code, industry)
     VALUES ('tech','Technology')`
  );
});

afterAll(async () => {
  await db.end();
});

describe("POST /industries", () => {
  test("creates industry", async () => {
    const resp = await request(app)
      .post("/industries")
      .send({ code: "fin", industry: "Finance" });
    expect(resp.statusCode).toBe(201);
    expect(resp.body.industry).toEqual({ code: "fin", industry: "Finance" });
  });
});

describe("POST /industries/:code/companies", () => {
  test("associates company to industry", async () => {
    const resp = await request(app)
      .post("/industries/tech/companies")
      .send({ company_code: "apple" });
    expect(resp.statusCode).toBe(201);
    expect(resp.body.added).toEqual({ comp_code: "apple", ind_code: "tech" });
  });
});

describe("GET /industries", () => {
  test("lists industries with companies", async () => {
    await db.query(
      `INSERT INTO companies_industries (comp_code, ind_code)
       VALUES ('apple','tech')`
    );
    const resp = await request(app).get("/industries");
    expect(resp.statusCode).toBe(200);
    const tech = resp.body.industries.find(i => i.code === "tech");
    expect(tech).toBeTruthy();
    expect(tech.companies).toContain("apple");
  });
});