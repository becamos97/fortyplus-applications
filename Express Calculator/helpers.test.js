const { mean, median, mode } = require("./helpers");

describe("helpers (pure functions)", () => {
  test("mean works", () => {
    expect(mean([1, 3, 5, 7])).toBe(4);
    expect(mean([2, 2, 2])).toBe(2);
  });

  test("median works", () => {
    expect(median([1, 3, 5])).toBe(3);
    expect(median([1, 3, 5, 7])).toBe(4);
    expect(median([7])).toBe(7);
  });

  test("mode works (tie -> smallest)", () => {
    expect(mode([1, 1, 2, 2, 3])).toBe(1);
    expect(mode([5, 5, 5, 2, 2, 3])).toBe(5);
  });

  test("empty arrays throw", () => {
    expect(() => mean([])).toThrow();
    expect(() => median([])).toThrow();
    expect(() => mode([])).toThrow();
  });
});