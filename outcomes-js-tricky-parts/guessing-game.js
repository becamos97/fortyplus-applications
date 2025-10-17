function guessingGame() {
  const answer = Math.floor(Math.random() * 100);
  let guesses = 0;
  let won = false;

  return function guess(n) {
    if (won) return "The game is over, you already won!";
    guesses++;

    if (n === answer) {
      won = true;
      const tries = guesses === 1 ? "1 guess" : `${guesses} guesses`;
      return `You win! You found ${answer} in ${tries}.`;
    }
    if (n < answer) return `${n} is too low!`;
    return `${n} is too high!`;
  };
}

module.exports = { guessingGame };
