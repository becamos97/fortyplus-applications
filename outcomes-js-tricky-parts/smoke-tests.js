// Guessing game
const game = guessingGame();
// game(50) -> "50 is too low!" / "... high!"
// eventually -> "You win! You found X in N guesses."
// next call  -> "The game is over, you already won!"

// Bank
const acct = createAccount("1234", 100);
acct.checkBalance("oops");                 // "Invalid PIN."
acct.deposit("1234", 250);                 // "Successfully deposited $250. Current balance: $350."
acct.withdraw("1234", 300);                // "Successfully withdrew $300. Current balance: $50."
acct.withdraw("1234", 100);                // "Withdrawal amount exceeds account balance. Transaction cancelled."
acct.changePin("1234", "5678");            // "PIN successfully changed!"
acct.checkBalance("5678");                 // "$50"

// Curried add
const a = curriedAdd(), b = curriedAdd(), c = curriedAdd();
a();                   // 0
b(1)(2)();             // 3
c(2)(8)(5)(1)();       // 16