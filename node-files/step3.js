const fs = require('fs');
const axios = require('axios');

function isURL(str) {
  return /^https?:\/\//i.test(str);
}

function handleOutput(text, outPath) {
  if (outPath) {
    fs.writeFile(outPath, text, 'utf8', function (err) {
      if (err) {
        console.error(`Couldn't write ${outPath}:\n  ${err}`);
        process.exit(1);
      }
      // Success: no console output as per spec
    });
  } else {
    console.log(text);
  }
}

function cat(path, outPath) {
  fs.readFile(path, 'utf8', function (err, data) {
    if (err) {
      console.error(`Error reading ${path}:\n  ${err}`);
      process.exit(1);
    }
    handleOutput(data, outPath);
  });
}

async function webCat(url, outPath) {
  try {
    const resp = await axios.get(url);
    handleOutput(resp.data, outPath);
  } catch (err) {
    console.error(`Error fetching ${url}:\n  ${err}`);
    process.exit(1);
  }
}

// ---- CLI parsing ----
// node step3.js [--out outfile] <file|url>
let outPath = null;
let src = null;

if (process.argv[2] === '--out') {
  outPath = process.argv[3];
  src = process.argv[4];
} else {
  src = process.argv[2];
}

if (!src) {
  console.error('Usage:\n  node step3.js <file|url>\n  node step3.js --out <outfile> <file|url>');
  process.exit(1);
}

if (isURL(src)) {
  webCat(src, outPath);
} else {
  cat(src, outPath);
}