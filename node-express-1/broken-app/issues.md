# Broken App Issues

Missing express.json() to req.body undefined

Mapping async without await Promise.all -> array of promises used like responses

catch { next(err); } -> err not defined; should be catch (err) { next(err) }

No centralized error handler middleware

Sends JSON.stringify(out) manually; prefer res.json(out)

No input validation for { developers: [...] }
