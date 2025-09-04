const express = require("express");
const fs = require("fs/promises");
const path = require("path");
const ExpressError = require("./expressError");
const { parseNums } = require("./utils");
const { mean, median, mode } = require("./helpers");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** Respond helper: honors Accept header for JSON vs HTML. */
function respond(req, res, payload) {
  // payload is like { operation: "mean", value: 4 } or {operation:"all", mean:.., median:.., mode:..}
  if (req.accepts(["json", "html"]) === "html") {
    const body = `
      <!doctype html>
      <html><body>
        <h1>Express Calculator</h1>
        <pre>${escapeHtml(JSON.stringify(payload, null, 2))}</pre>
      </body></html>`;
    return res.type("html").send(body);
  }
  return res.json({ response: payload });
}

function escapeHtml(str) {
  return str.replace(/[&<>"]/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;" }[ch]));
}

/** Optional: save result to results.json when ?save=true */
async function maybeSave(req, data) {
  if (!("save" in req.query)) return; // not provided => ignore
  const shouldSave = String(req.query.save).toLowerCase() === "true";
  if (!shouldSave) return;

  const file = path.join(process.cwd(), "results.json");
  const entry = {
    timestamp: new Date().toISOString(),
    ...data
  };

  try {
    let arr = [];
    try {
      const raw = await fs.readFile(file, "utf8");
      arr = JSON.parse(raw);
      if (!Array.isArray(arr)) arr = [];
    } catch {
      // file missing or invalid -> start fresh
      arr = [];
    }
    arr.push(entry);
    await fs.writeFile(file, JSON.stringify(arr, null, 2));
  } catch (err) {
    // Saving should not break the response; log and continue
    console.error("Failed saving results.json:", err.message);
  }
}

/** GET /mean?nums=1,2,3 */
app.get("/mean", async function (req, res, next) {
  try {
    const nums = parseNums(req.query.nums || "");
    const value = mean(nums);
    const payload = { operation: "mean", value };
    await maybeSave(req, { operation: "mean", nums, value });
    return respond(req, res, payload);
  } catch (err) {
    return next(err);
  }
});

/** GET /median?nums=... */
app.get("/median", async function (req, res, next) {
  try {
    const nums = parseNums(req.query.nums || "");
    const value = median(nums);
    const payload = { operation: "median", value };
    await maybeSave(req, { operation: "median", nums, value });
    return respond(req, res, payload);
  } catch (err) {
    return next(err);
  }
});

/** GET /mode?nums=... */
app.get("/mode", async function (req, res, next) {
  try {
    const nums = parseNums(req.query.nums || "");
    const value = mode(nums);
    const payload = { operation: "mode", value };
    await maybeSave(req, { operation: "mode", nums, value });
    return respond(req, res, payload);
  } catch (err) {
    return next(err);
  }
});

/** BONUS: GET /all?nums=...&save=true|false
 *  Returns mean, median, mode in one hit.
 */
app.get("/all", async function (req, res, next) {
  try {
    const nums = parseNums(req.query.nums || "");
    const result = {
      operation: "all",
      mean: mean(nums),
      median: median(nums),
      mode: mode(nums)
    };
    await maybeSave(req, { operation: "all", nums, ...result });
    return respond(req, res, result);
  } catch (err) {
    return next(err);
  }
});

/** 404 handler */
app.use(function notFound(req, res, next) {
  return next(new ExpressError("Not Found", 404));
});

/** Global error handler */
app.use(function errorHandler(err, req, res, next) {
  const status = err.status || 400; // NaN & missing input are 400 by spec here
  const message = err.message || "Bad Request";
  if (req.accepts(["json", "html"]) === "html") {
    const html = `<!doctype html><html><body><h1>Error</h1><p>Status: ${status}</p><p>${escapeHtml(message)}</p></body></html>`;
    return res.status(status).type("html").send(html);
  }
  return res.status(status).json({ error: { message, status } });
});

module.exports = app;