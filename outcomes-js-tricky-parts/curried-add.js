function curriedAdd() {
  let total = 0;

  function adder(n) {
    if (n === undefined) return total;
    total += Number(n);
    return adder;
  }

  return adder;
}

module.exports = { curriedAdd };
