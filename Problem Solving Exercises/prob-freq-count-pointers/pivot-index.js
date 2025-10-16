// add whatever parameters you deem necessary
// pivotIndex([1,2,1,6,3,1]) // 3
// pivotIndex([5,2,7]) // -1  no valid pivot index
// pivotIndex([-1,3,-3,2]) // 1 valid pivot at 2: -1 + 3 = 2 however there is a smaller valid pivot at 1: -1 = -3 + 2


function pivotIndex(arr) {
  const totalSum = arr.reduce((sum, num) => sum + num, 0);
  let leftSum = 0;
  
  for (let i = 0; i < arr.length; i++) {
    const rightSum = totalSum - leftSum - arr[i];
    
    if (leftSum === rightSum) {
      return i;
    }
    
    leftSum += arr[i];
  }
  
  return -1;
}