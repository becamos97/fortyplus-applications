/** product: calculate the product of an array of numbers. */
function product(nums, i = 0) {
  if (i === nums.length) return 1;
  return nums[i] * product(nums, i + 1);
}

/** longest: return the length of the longest word in an array of words. */
function longest(words, i = 0) {
  if (i === words.length) return 0;
  const curr = words[i].length;
  const restMax = longest(words, i + 1);
  return curr > restMax ? curr : restMax;
}

/** everyOther: return a string with every other letter. */
function everyOther(str, i = 0, out = "") {
  if (i >= str.length) return out;
  out += str[i];
  return everyOther(str, i + 2, out);
}

/** isPalindrome: checks whether a string is a palindrome or not. */
function isPalindrome(str, left = 0, right = str.length - 1) {
  if (left >= right) return true;
  if (str[left] !== str[right]) return false;
  return isPalindrome(str, left + 1, right - 1);
}

/** findIndex: return the index of val in arr (or -1 if val is not present). */
function findIndex(arr, val, i = 0) {
  if (i === arr.length) return -1;
  if (arr[i] === val) return i;
  return findIndex(arr, val, i + 1);
}

/** revString: return a copy of a string, but in reverse. */
function revString(str, i = str.length - 1, out = "") {
  if (i < 0) return out;
  out += str[i];
  return revString(str, i - 1, out);
}

/** gatherStrings: given an object, return array of all the values that are strings. */
function gatherStrings(obj) {
  const out = [];

  function scanObject(o) {
    const keys = Object.keys(o);
    function scanKeys(k = 0) {
      if (k === keys.length) return;
      const v = o[keys[k]];
      if (typeof v === "string") {
        out.push(v);
      } else if (v && typeof v === "object") {
        if (Array.isArray(v)) {
          scanArray(v);
        } else {
          scanObject(v);
        }
      }
      return scanKeys(k + 1);
    }
    return scanKeys(0);
  }

  function scanArray(a, j = 0) {
    if (j === a.length) return;
    const v = a[j];
    if (typeof v === "string") {
      out.push(v);
    } else if (v && typeof v === "object") {
      if (Array.isArray(v)) {
        scanArray(v);
      } else {
        scanObject(v);
      }
    }
    return scanArray(a, j + 1);
  }

  scanObject(obj);
  return out;
}

/** binarySearch: given a sorted array of numbers, and a value,
 *  return the index of that value (or -1 if not present).
 *  Runs in O(log n) via recursion.
 */
function binarySearch(arr, val, left = 0, right = arr.length - 1) {
  if (left > right) return -1;
  const mid = Math.floor((left + right) / 2);
  if (arr[mid] === val) return mid;
  if (val < arr[mid]) return binarySearch(arr, val, left, mid - 1);
  return binarySearch(arr, val, mid + 1, right);
}

module.exports = {
  product,
  longest,
  everyOther,
  isPalindrome,
  findIndex,
  revString,
  gatherStrings,
  binarySearch
};