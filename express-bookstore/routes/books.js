const express = require("express");
const jsonschema = require("jsonschema");
const router = new express.Router();

const Book = require("../models/book");
const ExpressError = require("../expressError");

const bookCreateSchema = require("../schemas/bookCreateSchema.json");
const bookUpdateSchema = require("../schemas/bookUpdateSchema.json");

/** GET /books => { books: [ {isbn, amazon_url, author, language, pages, publisher, title, year}, ... ] } */
router.get("/", async function (req, res, next) {
  try {
    const books = await Book.findAll();
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

/** GET /books/:isbn => { book } */
router.get("/:isbn", async function (req, res, next) {
  try {
    const book = await Book.get(req.params.isbn);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** POST /books => { book }  (validate body) */
router.post("/", async function (req, res, next) {
  try {
    const validation = jsonschema.validate(req.body, bookCreateSchema);
    if (!validation.valid) {
      const errors = validation.errors.map(e => e.stack);
      throw new ExpressError(errors, 400);
    }
    const book = await Book.create(req.body);
    return res.status(201).json({ book });
  } catch (err) {
    return next(err);
  }
});

/** PUT /books/:isbn => { book }  (validate body; disallow isbn changes) */
router.put("/:isbn", async function (req, res, next) {
  try {
    // Don’t let clients sneak in an isbn change:
    if ("isbn" in req.body && req.body.isbn !== req.params.isbn) {
      throw new ExpressError(["Body ISBN must not differ from path ISBN"], 400);
    }

    const validation = jsonschema.validate(req.body, bookUpdateSchema);
    if (!validation.valid) {
      const errors = validation.errors.map(e => e.stack);
      throw new ExpressError(errors, 400);
    }

    const book = await Book.update(req.params.isbn, req.body);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /books/:isbn => { message: "Book deleted" } */
router.delete("/:isbn", async function (req, res, next) {
  try {
    await Book.remove(req.params.isbn);
    return res.json({ message: "Book deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;