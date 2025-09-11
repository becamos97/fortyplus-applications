process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const db = require("../db");

let b1;

beforeAll(async () => {
  await db.query("DELETE FROM books");
});

beforeEach(async () => {
  const result = await db.query(
    `INSERT INTO books
      (isbn, amazon_url, author, language, pages, publisher, title, year)
     VALUES
      ('1111111111','http://a.co/ok','Author One','english',100,'Pub One','Title One',2001)
     RETURNING isbn, amazon_url, author, language, pages, publisher, title, year`
  );
  b1 = result.rows[0];
});

afterEach(async () => {
  await db.query("DELETE FROM books");
});

afterAll(async () => {
  await db.end();
});

describe("GET /books", () => {
  test("works", async () => {
    const resp = await request(app).get("/books");
    expect(resp.statusCode).toBe(200);
    expect(resp.body.books).toHaveLength(1);
    expect(resp.body.books[0]).toMatchObject({
      isbn: b1.isbn,
      title: b1.title
    });
  });
});

describe("GET /books/:isbn", () => {
  test("works", async () => {
    const resp = await request(app).get(`/books/${b1.isbn}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.book.isbn).toBe(b1.isbn);
  });

  test("404 for missing", async () => {
    const resp = await request(app).get(`/books/9999999999`);
    expect(resp.statusCode).toBe(404);
  });
});

describe("POST /books", () => {
  const valid = {
    isbn: "0691161518",
    amazon_url: "http://a.co/eobPtX2",
    author: "Matthew Lane",
    language: "english",
    pages: 264,
    publisher: "Princeton University Press",
    title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
    year: 2017
  };

  test("creates", async () => {
    const resp = await request(app).post("/books").send(valid);
    expect(resp.statusCode).toBe(201);
    expect(resp.body.book.isbn).toBe(valid.isbn);
  });

  test("400 on invalid url", async () => {
    const bad = { ...valid, amazon_url: "nota-url" };
    const resp = await request(app).post("/books").send(bad);
    expect(resp.statusCode).toBe(400);
    expect(resp.body.error.message).toEqual(expect.arrayContaining([expect.any(String)]));
  });

  test("400 on missing field", async () => {
    const bad = { ...valid };
    delete bad.title;
    const resp = await request(app).post("/books").send(bad);
    expect(resp.statusCode).toBe(400);
  });
});

describe("PUT /books/:isbn", () => {
  const validUpdate = {
    amazon_url: "http://a.co/new",
    author: "New Author",
    language: "english",
    pages: 999,
    publisher: "New Pub",
    title: "New Title",
    year: 2020
  };

  test("updates", async () => {
    const resp = await request(app).put(`/books/${b1.isbn}`).send(validUpdate);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.book.title).toBe("New Title");
  });

  test("400 on invalid data", async () => {
    const bad = { ...validUpdate, pages: 0 }; // must be >= 1
    const resp = await request(app).put(`/books/${b1.isbn}`).send(bad);
    expect(resp.statusCode).toBe(400);
  });

  test("400 if trying to change isbn", async () => {
    const bad = { ...validUpdate, isbn: "2222222222" };
    const resp = await request(app).put(`/books/${b1.isbn}`).send(bad);
    expect(resp.statusCode).toBe(400);
  });

  test("404 for missing isbn", async () => {
    const resp = await request(app).put(`/books/9999999999`).send(validUpdate);
    expect(resp.statusCode).toBe(404);
  });
});

describe("DELETE /books/:isbn", () => {
  test("deletes", async () => {
    const resp = await request(app).delete(`/books/${b1.isbn}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ message: "Book deleted" });
  });

  test("404 for missing", async () => {
    const resp = await request(app).delete(`/books/9999999999`);
    expect(resp.statusCode).toBe(404);
  });
});