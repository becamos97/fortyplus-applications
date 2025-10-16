// add whatever parameters you deem necessary
// constructNote('aa', 'abc') // false
// constructNote('abc', 'dcba') // true
// constructNote('aabbcc', 'bcabcaddff') // true


function constructNote(message, letters) {
  if (message.length === 0) return true;
  if (letters.length === 0) return false;
  
  const letterCount = {};
  
  // Count frequency of each letter
  for (let char of letters) {
    letterCount[char] = (letterCount[char] || 0) + 1;
  }
  
  // Check if we can build the message
  for (let char of message) {
    if (!letterCount[char] || letterCount[char] === 0) {
      return false;
    }
    letterCount[char]--;
  }
  
  return true;
}