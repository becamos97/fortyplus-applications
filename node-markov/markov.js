/** Textual markov chain generator */

class MarkovMachine {

  /** build markov machine; read in text.*/
  constructor(text) {
    let words = text.split(/[ \r\n]+/);
    this.words = words.filter(c => c !== "");
    this.makeChains();
  }

  /** set markov chains:
   *
   *  for text of "the cat in the hat", chains will be
   *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */
  makeChains() {
    this.chains = new Map();
    for (let i = 0; i < this.words.length; i++) {
      const word = this.words[i];
      const next = this.words[i + 1] || null;
      if (!this.chains.has(word)) this.chains.set(word, []);
      this.chains.get(word).push(next);
    }
  }

  /** choose a random element from an array */
  static choice(arr) {
    const idx = Math.floor(Math.random() * arr.length);
    return arr[idx];
  }

  /** return random text from chains */
  makeText(numWords = 100) {
    if (this.words.length === 0) return "";

    // start with a random word
    let word = MarkovMachine.choice(this.words);
    const out = [word];

    while (out.length < numWords) {
      const nextWords = this.chains.get(word);
      if (!nextWords) break;
      const next = MarkovMachine.choice(nextWords);
      if (next === null) break;
      out.push(next);
      word = next;
    }

    return out.join(" ");
  }
}

module.exports = { MarkovMachine };