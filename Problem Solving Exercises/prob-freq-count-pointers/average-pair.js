// // averagePair([1, 2, 3], 2.5); // true
// averagePair([1, 3, 3, 5, 6, 7, 10, 12, 19], 8); // true
// averagePair([-1, 0, 3, 4, 5, 6], 4.1); // false
// averagePair([], 4); // false
// // add whatever parameters you deem necessary
function averagePair(arr, targetAvg) {
  if (arr.length === 0) return false;
  
  let left = 0;
  let right = arr.length - 1;
  
  while (left < right) {
    const avg = (arr[left] + arr[right]) / 2;
    
    if (avg === targetAvg) {
      return true;
    } else if (avg < targetAvg) {
      left++;
    } else {
      right--;
    }
  }
  
  return false;
}