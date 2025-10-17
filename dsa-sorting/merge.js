function merge(arr1, arr2) {
  const out = [];
  let i = 0, j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] <= arr2[j]) {
      out.push(arr1[i++]);   // <= keeps it stable
    } else {
      out.push(arr2[j++]);
    }
  }
  // Append leftovers
  while (i < arr1.length) out.push(arr1[i++]);
  while (j < arr2.length) out.push(arr2[j++]);

  return out;
}

function mergeSort(arr) {
  const n = arr.length;
  if (n <= 1) return arr.slice();

  const mid = Math.floor(n / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

module.exports = { merge, mergeSort};