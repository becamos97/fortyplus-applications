// File OR URL. Uses axios for URLs.

const fs = require('fs');
const axios = require('axios');

function cat(path) {
  fs.readFile(path, 'utf8', function (err, data) {
    if (err) {
      console.error(`Error reading ${path}:\n  ${err}`);
      process.exit(1);
    }
    console.log(data);
  });
}

async function webCat(url) {
  try {
    const resp = await axios.get(url);
    console.log(resp.data);
  } catch (err) {
    console.error(`Error fetching ${url}:\n  ${err}`);
    process.exit(1);
  }
}

function isURL(str) {
  return /^https?:\/\//i.test(str);
}

// CLI
const input = process.argv[2];
if (!input) {
  console.error('Usage: node step2.js <file|url>');
  process.exit(1);
}

if (isURL(input)) {
  webCat(input);
} else {
  cat(input);
}