function createAccount(pin, initialDeposit = 0) {
  let currentPin = String(pin);
  let balance = Number(initialDeposit);

  const invalid = "Invalid PIN.";

  function checkPin(p) {
    return String(p) === currentPin;
  }

  return {
    checkBalance(p) {
      if (!checkPin(p)) return invalid;
      return `$${balance}`;
    },

    deposit(p, amount) {
      if (!checkPin(p)) return invalid;
      const amt = Number(amount);
      balance += amt;
      return `Successfully deposited $${amt}. Current balance: $${balance}.`;
    },

    withdraw(p, amount) {
      if (!checkPin(p)) return invalid;
      const amt = Number(amount);
      if (amt > balance) {
        return "Withdrawal amount exceeds account balance. Transaction cancelled.";
      }
      balance -= amt;
      return `Successfully withdrew $${amt}. Current balance: $${balance}.`;
    },

    changePin(oldPin, newPin) {
      if (!checkPin(oldPin)) return invalid;
      currentPin = String(newPin);
      return "PIN successfully changed!";
    }
  };
}

module.exports = { createAccount };
