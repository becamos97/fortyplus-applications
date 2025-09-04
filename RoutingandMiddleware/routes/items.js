const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
let items = require("../fakeDb");

/** GET /items -> list (raw array, per spec) */
router.get("/", function (req, res) {
  return res.json(items);
});

/** POST /items -> { added: {name, price} } */
router.post("/", function (req, res, next) {
  try {
    const { name, price } = req.body;
    if (!name) throw new ExpressError("Name is required", 400);
    if (price === undefined) throw new ExpressError("Price is required", 400);
    if (typeof price !== "number" || !Number.isFinite(price)) {
      throw new ExpressError("Price must be a number", 400);
    }
    const item = { name, price };
    items.push(item);
    return res.status(201).json({ added: item });
  } catch (err) {
    return next(err);
  }
});

/** GET /items/:name -> { name, price } */
router.get("/:name", function (req, res, next) {
  try {
    const found = items.find(i => i.name === req.params.name);
    if (!found) throw new ExpressError("Item not found", 404);
    return res.json(found);
  } catch (err) {
    return next(err);
  }
});

/** PATCH /items/:name -> { updated: {name, price} } */
router.patch("/:name", function (req, res, next) {
  try {
    const item = items.find(i => i.name === req.params.name);
    if (!item) throw new ExpressError("Item not found", 404);

    const { name, price } = req.body;

    if (name !== undefined) {
      if (!name) throw new ExpressError("Name cannot be empty", 400);
      item.name = name;
    }
    if (price !== undefined) {
      if (typeof price !== "number" || !Number.isFinite(price)) {
        throw new ExpressError("Price must be a number", 400);
      }
      item.price = price;
    }

    return res.json({ updated: item });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /items/:name -> { message: "Deleted" } */
router.delete("/:name", function (req, res, next) {
  try {
    const idx = items.findIndex(i => i.name === req.params.name);
    if (idx === -1) throw new ExpressError("Item not found", 404);
    items.splice(idx, 1);
    return res.json({ message: "Deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;