function bubbleSort(arr) {
  const a = arr.slice(); // keep original untouched
  let n = a.length;
  let swapped = true;

  // After each pass, the last element is in place; shrink the range.
  while (swapped) {
    swapped = false;
    for (let j = 1; j < n; j++) {
      if (a[j - 1] > a[j]) {
        const tmp = a[j - 1];
        a[j - 1] = a[j];
        a[j] = tmp;
        swapped = true;
      }
    }
    n--;
  }
  return a;
}

module.exports = bubbleSort;