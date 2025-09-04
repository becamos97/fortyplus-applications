/** Pure math helpers for mean/median/mode (no Express code here). */

/** mean: average of numbers; throws on empty. */
function mean(nums) {
  if (!nums.length) throw new Error("Cannot compute mean of empty list.");
  const sum = nums.reduce((a, b) => a + b, 0);
  return sum / nums.length;
}

/** median: midpoint (average of 2 middles if even); throws on empty. */
function median(nums) {
  if (!nums.length) throw new Error("Cannot compute median of empty list.");
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[mid];
  return (sorted[mid - 1] + sorted[mid]) / 2;
}

/** mode: most frequent value; if tie, return the smallest of the tied. */
function mode(nums) {
  if (!nums.length) throw new Error("Cannot compute mode of empty list.");
  const freq = new Map();
  for (let n of nums) freq.set(n, (freq.get(n) || 0) + 1);

  let bestNum = null;
  let bestCount = 0;

  for (let [n, count] of freq.entries()) {
    if (count > bestCount || (count === bestCount && (bestNum === null || n < bestNum))) {
      bestNum = n;
      bestCount = count;
    }
  }
  return bestNum;
}

module.exports = { mean, median, mode };