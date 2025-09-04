const ExpressError = require("./expressError");

/** parseNums: parse ?nums=1,3,5 into [1,3,5]
 *  - throws ExpressError(400) on missing or NaN with message like "foo is not a number."
 */
function parseNums(queryString) {
  if (queryString === undefined || queryString.trim() === "") {
    throw new ExpressError("nums are required.", 400);
  }
  const parts = queryString.split(",").map(s => s.trim());
  const nums = [];
  for (let p of parts) {
    const val = Number(p);
    if (p === "" || Number.isNaN(val)) {
      throw new ExpressError(`${p || "(empty)"} is not a number.`, 400);
    }
    nums.push(val);
  }
  return nums;
}

module.exports = { parseNums };