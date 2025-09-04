process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../../app");
let items = require("../../fakeDb");

let seed = { name: "popsicle", price: 1.45 };

beforeEach(function () {
  items.push({ ...seed });
});

afterEach(function () {
  items.length = 0; // mutate in place
});

describe("GET /items", function () {
  test("returns list", async function () {
    const resp = await request(app).get("/items");
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual([seed]);
  });
});

describe("POST /items", function () {
  test("adds item", async function () {
    const resp = await request(app)
      .post("/items")
      .send({ name: "cheerios", price: 3.4 });
    expect(resp.statusCode).toBe(201);
    expect(resp.body).toEqual({ added: { name: "cheerios", price: 3.4 } });
  });

  test("400 on missing name", async function () {
    const resp = await request(app).post("/items").send({ price: 1.23 });
    expect(resp.statusCode).toBe(400);
  });

  test("400 on missing price", async function () {
    const resp = await request(app).post("/items").send({ name: "chips" });
    expect(resp.statusCode).toBe(400);
  });

  test("400 on non-numeric price", async function () {
    const resp = await request(app).post("/items").send({ name: "chips", price: "x" });
    expect(resp.statusCode).toBe(400);
  });
});

describe("GET /items/:name", function () {
  test("gets one", async function () {
    const resp = await request(app).get("/items/popsicle");
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual(seed);
  });

  test("404 if missing", async function () {
    const resp = await request(app).get("/items/nope");
    expect(resp.statusCode).toBe(404);
  });
});

describe("PATCH /items/:name", function () {
  test("updates name & price", async function () {
    const resp = await request(app)
      .patch("/items/popsicle")
      .send({ name: "new popsicle", price: 2.45 });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ updated: { name: "new popsicle", price: 2.45 } });
  });

  test("updates just name", async function () {
    const resp = await request(app)
      .patch("/items/popsicle")
      .send({ name: "pop" });
    expect(resp.statusCode).toBe(200);
    expect(resp.body.updated.name).toBe("pop");
    expect(resp.body.updated.price).toBe(1.45);
  });

  test("updates just price", async function () {
    const resp = await request(app)
      .patch("/items/popsicle")
      .send({ price: 9.99 });
    expect(resp.statusCode).toBe(200);
    expect(resp.body.updated.name).toBe("popsicle");
    expect(resp.body.updated.price).toBe(9.99);
  });

  test("400 invalid price", async function () {
    const resp = await request(app)
      .patch("/items/popsicle")
      .send({ price: "nope" });
    expect(resp.statusCode).toBe(400);
  });

  test("404 missing item", async function () {
    const resp = await request(app).patch("/items/ghost").send({ name: "boo" });
    expect(resp.statusCode).toBe(404);
  });
});

describe("DELETE /items/:name", function () {
  test("deletes", async function () {
    const resp = await request(app).delete("/items/popsicle");
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ message: "Deleted" });
  });

  test("404 missing item", async function () {
    const resp = await request(app).delete("/items/nope");
    expect(resp.statusCode).toBe(404);
  });
});