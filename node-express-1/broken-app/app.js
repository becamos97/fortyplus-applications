const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json()); // parse JSON bodies

// POST /
// Body: { developers: [ "username", ... ] }
// Response: [ { name, bio }, ... ]
app.post('/', async function (req, res, next) {
  try {
    const devs = req.body && Array.isArray(req.body.developers) ? req.body.developers : null;
    if (!devs) {
      return res.status(400).json({ error: "Expected JSON body like { developers: [\"username\", ...] }" });
    }

    // fire off all requests concurrently & wait for all
    const results = await Promise.allSettled(
      devs.map((u) => axios.get(`https://api.github.com/users/${u}`))
    );

    // map successful results to {name, bio}; include error notes for failed ones
    const out = results.map((r, idx) => {
      if (r.status === "fulfilled") {
        const d = r.value.data;
        return { name: d.name, bio: d.bio };
      } else {
        return { name: devs[idx], error: "lookup failed" };
      }
    });

    return res.json(out);
  } catch (err) {
    return next(err);
  }
});

// basic error handler
app.use(function (err, req, res, next) {
  console.error(err.stack || err);
  const status = err.status || 500;
  return res.status(status).json({ error: err.message || "Server error" });
});

app.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});