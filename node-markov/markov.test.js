const { MarkovMachine } = require("./markov");

describe("MarkovMachine", () => {
  const text = "the cat in the hat is in the hat";
  let mm;

  beforeEach(() => {
    mm = new MarkovMachine(text);
  });

  test("builds chains with duplicates and null termination", () => {
    expect(mm.chains.get("the").sort()).toEqual(["cat", "hat", "hat"].sort());
    expect(mm.chains.get("cat")).toEqual(["in"]);
    expect(mm.chains.get("in")).toEqual(["the", "the"]);
    expect(mm.chains.get("hat")).toContain("is");
    expect(mm.chains.get("hat")).toContain(null);
  });

  test("choice picks from array", () => {
    const arr = ["a", "b", "c"];
    for (let i = 0; i < 20; i++) {
      expect(arr).toContain(MarkovMachine.choice(arr));
    }
  });

  test("makeText returns at most numWords and uses known words", () => {
    const out = mm.makeText(10);
    const words = out.split(/\s+/);
    expect(words.length).toBeLessThanOrEqual(10);
    for (const w of words) {
      expect(mm.words).toContain(w);
    }
  });

  test("empty input yields empty output", () => {
    const empty = new MarkovMachine("");
    expect(empty.makeText(10)).toBe("");
  });
});